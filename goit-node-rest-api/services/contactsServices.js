// import fs from "fs/promises";
// import path from "path";
// import { nanoid } from "nanoid";

// const contactsPath = path.resolve("db", "contacts.json");

// function updateContacts(contacts) {
//   return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
// }
import Contact from "../models/Contact.js";

export function listContacts() {
  return Contact.find();
}
// {
// const buffer = await fs.readFile(contactsPath);
// return JSON.parse(buffer);

// }

export async function getContactById(contactId) {
  // const contacts = await listContacts();
  // const result = contacts.find((item) => item.id === contactId);
  // return result || null;
  return Contact.findById(contactId);
}

export async function removeContact(contactId) {
  // const contacts = await listContacts();
  // const index = contacts.findIndex((item) => item.id === contactId);
  // if (index === -1) {
  //   return null;
  // }
  // const [deletedContact] = contacts.splice(index, 1);
  // await updateContacts(contacts);
  // return deletedContact;
  return Contact.findByIdAndDelete(contactId);
}

export async function addContact(data) {
  return Contact.create(data);
}
// {
// const contacts = await listContacts();
// const newContact = {
//   id: nanoid(),
//   name,
//   email,
//   phone,
// };
// contacts.push(newContact);
// await updateContacts(contacts);
// return newContact;
// return
// }

export async function updateContactById(contactId, data) {
  // const contacts = await listContacts();
  // const index = contacts.findIndex((item) => item.id === contactId);
  // if (index === -1) {
  //   return null;
  // }
  // contacts[index] = { ...contacts[index], ...data };
  // await updateContacts(contacts);
  // return contacts[index];
  return Contact.findByIdAndUpdate(contactId, data);
}

export async function updateStatusContactById(contactId, data) {
  // const contacts = await listContacts();
  // const index = contacts.findIndex((item) => item.id === contactId);
  // if (index === -1) {
  //   return null;
  // }
  // contacts[index] = { ...contacts[index], ...data };
  // await updateContacts(contacts);
  // return contacts[index];
  return Contact.findByIdAndUpdate(contactId, data);
}
