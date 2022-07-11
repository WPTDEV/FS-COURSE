import fs from "fs/promises";
import { nanoid } from "nanoid";

const contactsPath = `./db/contacts.json`;

// Return contacts list from DB file
async function listContacts() {
    try {
        const contactList = await fs.readFile(contactsPath);
        return JSON.parse(contactList);
    } catch (err) {
        console.log(err);
    }
}

// Get signle contact by ID
async function getContactById(contactId) {
    const contacts = await listContacts();

    return contacts.find(item => item.id === contactId) ?? `Contact with id ${contactId} not found`;
}

// Remove single contact by ID
async function removeContact(contactId) {
    const contacts = await listContacts();

    const newContacts = contacts.filter(item => {
        return item.id !== contactId;
    });

    await updateContacts(newContacts);
    return newContacts;
}

// Add bew contact to DB file
async function addContact(name, email, phone) {
    if (!name || !email || !phone) {
        return 'Please enter correct params (Name, email, phone)'
    }

    const contacts = await listContacts();
    const contact = {
        id: nanoid(),
        name,
        email,
        phone
    };

    contacts.push(contact);
    await updateContacts(contacts);
    return contact;
}

// Update contacts in DB file
const updateContacts = async (contacts) => {
    try {
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    } catch (err) {
        console.log(err);
    }
}

export default { listContacts, getContactById, removeContact, addContact };