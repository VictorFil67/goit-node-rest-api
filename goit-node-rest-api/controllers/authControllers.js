import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";

import { register, setToken } from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUser, updateByFilter } from "../services/userServices.js";
import { nanoid } from "nanoid";
import "dotenv/config"; // Для сохранения переменных окружения в объекте process.env. Вместо этого можно:
// import dotenv from "dotenv";
// dotenv.config();

const avatarsDir = path.resolve("public", "avatars");

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email } = req.body;

  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();

  const avatarURL = gravatar.url(email);

  const newUser = await register({ ...req.body, avatarURL, verificationToken });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">CLick to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await findUser({ verificationToken });
  // console.log(user);
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await updateByFilter(
    { _id: user._id },
    { verify: true, verificationToken: null }
  );

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing required field email");
  }
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">CLick to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "23h",
  });
  await setToken(user.id, token);
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await setToken(_id);
  res.status(204).json();
};

const updateSubscription = async (req, res) => {
  const { email } = req.user;
  const result = await updateByFilter({ email }, req.body);
  const { subscription } = result;
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { email } = req.user;

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsDir, filename);

  const file = await Jimp.read(oldPath);
  file.resize(250, 250);

  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);

  const result = await updateByFilter({ email }, { ...req.body, avatarURL });
  if (!result) {
    throw HttpError(401, "Not authorized");
  }
  res.status(200).json({
    avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
