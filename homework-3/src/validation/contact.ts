import Joi from 'joi';

const objectId = (value: string, helpers: any) => {
	if (!value.match(/^[0-9a-fA-F]{24}$/)) {
		return helpers.message('"{{#label}}" must be a valid mongo id');
	}
	return value;
};

export const createContact = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		name: Joi.string().required(),
		phone: Joi.string().required(),
	}),
};

export const getContacts = {
	query: Joi.object().keys({
		name: Joi.string(),
		role: Joi.string(),
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

export const getContact = {
	params: Joi.object().keys({
		id: Joi.string().custom(objectId),
	}),
};

export const updateContact = {
	params: Joi.object().keys({
		id: Joi.required().custom(objectId),
	}),
	body: Joi.object()
		.keys({
			email: Joi.string().email(),
			name: Joi.string(),
			phone: Joi.string(),
		})
		.min(3),
};

export const deleteContact = {
	params: Joi.object().keys({
		id: Joi.string().custom(objectId),
	}),
};

export const favorite = {
	params: Joi.object().keys({
		id: Joi.string().custom(objectId),
	}),
	body: Joi.object().keys({
		favorite: Joi.boolean().required(),
	}),
};
