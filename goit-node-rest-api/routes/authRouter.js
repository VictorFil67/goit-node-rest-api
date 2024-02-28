import express from "express";
import { signupSchema, signinSchema } from "../schemas/usersSchemas.js";
import validateBody from "../decorators/validateBody.js";
import authControllers from "../controllers/authControllers.js";
import authtenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

const { signup, signin, getCurrent, logout, updateSubscription, updateAvatar } =
  authControllers;

authRouter.post("/register", validateBody(signupSchema), signup);
authRouter.post("/login", validateBody(signinSchema), signin);
authRouter.get("/current", authtenticate, getCurrent);
authRouter.post("/logout", authtenticate, logout);
authRouter.patch("/", authtenticate, updateSubscription);
authRouter.patch(
  "/avatars",
  authtenticate,
  upload.single("avatarURL"),
  updateAvatar
);

export default authRouter;
