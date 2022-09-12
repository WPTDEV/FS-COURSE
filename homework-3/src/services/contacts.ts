import { error } from 'console';
import httpStatus from 'http-status';
import Contact from '../models/contact';
import ApiError from '../utils/apiError';


interface ContactRequest extends Request {
	email: string;
	name: string;
	phone: string;
	favorite: boolean;
}
/**
 * Create a contact
 * @param {Object} body
 * @returns {Promise<Contact>}
 */
export const create = async (body: ContactRequest) => {
	try { 
		if (await Contact.isEmailTaken(body.email, undefined)) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
		}

		if (await Contact.isPhoneTaken(body.phone, undefined)) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
		}

		return await Contact.create(body);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ApiError(error.statusCode, error.message);
		} else {
			throw new ApiError(500, 'Server error');
		}
	}
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
export const query = async (filter: {}, options: {}) => {
	try {
		return await Contact.paginate(filter, options);
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Server error');
	}
};

/**
 * Get Contact by id
 * @param {ObjectId} id
 * @returns {Promise<Contact>}
 */
export const getContactById = async (id: string) => {
	try {
		const contact = await Contact.findById(id);

		if (!contact) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
		}

		return contact;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ApiError(error.statusCode, error.message);
		} else {
			throw new ApiError(500, 'Server error');
		}
	}
};

/**
 * Update contact by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Contact>}
 */
export const updateContactById = async (id: string, updateBody: ContactRequest) => {
	try {
		const contact = await getContactById(id);

		if (!contact) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
		}

		if (updateBody.email && (await Contact.isEmailTaken(updateBody.email, id))) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
		}

		if (updateBody.phone && (await Contact.isPhoneTaken(updateBody.phone, id))) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
		}

		Object.assign(contact, updateBody);

		return await contact.save();
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ApiError(error.statusCode, error.message);
		} else {
			throw new ApiError(500, 'Server error');
		}
	}
};

/**
 * Delete contact by id
 * @param {ObjectId} id
 * @returns {Promise<Contact>}
 */
export const deleteContactById = async (id: string) => {
	try {
		const contact = await getContactById(id);

		if (!contact) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
		}

		return await contact.remove();;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ApiError(error.statusCode, error.message);
		} else {
			throw new ApiError(500, 'Server error');
		}
	}
};
