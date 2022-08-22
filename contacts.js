import fs from "fs/promises";
import { nanoid } from "nanoid";

const contactsPath = `./db/contcts.json`;

// Return contacts list from DB file
async function listContacts() {
    try {
        const contactList = await fs.readFile(contactsPath);
        return JSON.parse(contactList);
    } catch (err) {
        console.log(err);
        return null;
    }
}

// Get signle contact by ID
async function getContactById(contactId) {
    const contacts = await listContacts();

    return contacts?.find(item => item.id === contactId) ?? `Contact with id ${contactId} not found`;
}

// Remove single contact by ID
async function removeContact(contactId) {
    const contacts = await listContacts();

    if (contacts) {
        const newContacts = contacts.filter(item => {
            return item.id !== contactId;
        });
    
        return await updateContacts(newContacts);
    } else {
        return `Remove contact ID: ${contactId} failed`
    }
}

// Add bew contact to DB file
async function addContact(name, email, phone) {
    if (!name || !email || !phone) {
        return 'Please enter correct params (Name, email, phone)'
    }

    const contacts = await listContacts();

    if (contacts) {
        const contact = {
            id: nanoid(),
            name,
            email,
            phone
        };

        contacts.push(contact);
        return await updateContacts(contacts);
    } else {
        return `Add contact ${name} ${email} ${phone} failed`
    }
}

// Update contacts in DB file
const updateContacts = async (contacts) => {
    try {
        return await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    } catch (err) {
        console.log(err);
        return null;
    }
}

export default { listContacts, getContactById, removeContact, addContact };