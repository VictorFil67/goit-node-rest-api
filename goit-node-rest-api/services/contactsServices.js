import Contact from "../models/Contact.js";

export function listContacts() {
  return Contact.find();
}

export async function getContactById(contactId) {
  return Contact.findById(contactId);
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

export async function addContact(data) {
  return Contact.create(data);
}

export async function updateContactById(contactId, data) {
  return Contact.findByIdAndUpdate(contactId, data);
}

export async function updateStatusContactById(contactId, data) {
  return Contact.findByIdAndUpdate(contactId, data);
}
