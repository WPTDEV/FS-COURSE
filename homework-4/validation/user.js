import Joi from 'joi';

const objectId = (value, helpers) => {
	if (!value.match(/^[0-9a-fA-F]{24}$/)) {
		return helpers.message('"{{#label}}" must be a valid mongo id');
	}
	return value;
};

export const createUser = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		name: Joi.string().required(),
		phone: Joi.string().required(),
		passport: Joi.string().required(),
		birthday: Joi.string().required(),
	}),
};

export const getUsers = {
	query: Joi.object().keys({
		name: Joi.string(),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

export const getUser = {
	params: Joi.object().keys({
		id: Joi.string().custom(objectId),
	}),
};

export const updateUser = {
	params: Joi.object().keys({
		id: Joi.required().custom(objectId),
	}),
	body: Joi.object()
		.keys({
			email: Joi.string().email(),
			name: Joi.string(),
			phone: Joi.string(),
			passport: Joi.string().required(),
			birthday: Joi.string().required(),
		})
		.min(3),
};

export const deleteUser = {
	params: Joi.object().keys({
		id: Joi.string().custom(objectId),
	}),
};
