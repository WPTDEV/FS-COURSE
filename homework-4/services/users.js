import httpStatus from 'http-status';
import User from '../models/user.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<User>}
 */
export const create = async (body) => {
	if (await User.isEmailTaken(body.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}

	if (await User.isPhoneTaken(body.phone)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
	}

	return User.create(body);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
export const query = async (filter, options) => {
	const users = await User.paginate(filter, options);
	return users;
};

/**
 * Get User by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
export const getById = async (id) => {
	const user = await User.findById(id);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	return user;
};

/**
 * Update user by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
export const updateById = async (id, updateBody) => {
	const user = await getById(id);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	if (updateBody.email && (await User.isEmailTaken(updateBody.email, id))) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}

	Object.assign(user, updateBody);

	await user.save();
	return user;
};

/**
 * Delete user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
export const deleteById = async (id) => {
	const user = await getById(id);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	await user.remove();
	return user;
};
