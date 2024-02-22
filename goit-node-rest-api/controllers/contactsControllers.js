import {
  // listContacts,
  // getContactById,
  // removeContact,
  addContact,
  updateContactById,
  // updateStatusContactById,
  listContactsByFilter,
  getContactByFilter,
  removeContactByFilter,
  updateStatusContactByFilter,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await listContactsByFilter({ owner });
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  console.log(req.user);
  const { _id: owner } = req.user;
  const result = await getContactByFilter({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  console.log(req.user);
  const { _id: owner } = req.user;
  const result = await removeContactByFilter({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await addContact({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await updateContactById({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await updateStatusContactByFilter(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
