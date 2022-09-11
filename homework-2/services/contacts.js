import httpStatus from 'http-status';
import Contact from '../models/contact.js';
import ApiError from '../utils/apiError.js';

/**
 * Create a contact
 * @param {Object} body
 * @returns {Promise<Contact>}
 */
export const create = async (body) => {
	if (await Contact.isEmailTaken(body.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}

	if (await Contact.isPhoneTaken(body.phone)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
	}

	return Contact.create(body);
};

/**
 * Query for contacts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
export const query = async (filter, options) => {
	const contacts = await Contact.paginate(filter, options);
	return contacts;
};

/**
 * Get Contact by id
 * @param {ObjectId} id
 * @returns {Promise<Contact>}
 */
export const getContactById = async (id) => {
	const contact = await Contact.findById(id);

	if (!contact) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
	}

	return contact;
};

/**
 * Update contact by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Contact>}
 */
export const updateContactById = async (id, updateBody) => {
	const contact = await getContactById(id);

	if (!contact) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
	}

	if (updateBody.email && (await Contact.isEmailTaken(updateBody.email, id))) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}

	Object.assign(contact, updateBody);

	await contact.save();
	return contact;
};

/**
 * Delete contact by id
 * @param {ObjectId} id
 * @returns {Promise<Contact>}
 */
export const deleteContactById = async (id) => {
	const contact = await getContactById(id);

	if (!contact) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
	}

	await contact.remove();
	return contact;
};
