import * as contactService from '../services/contacts.js';
import { pick } from '../utils/pick.js';

export const add = async (req, res) => {
	const contact = await contactService.create(req.body);
	res.status(201).send(contact);
};

export const getAll = async (req, res) => {
	const filter = pick(req.query, ['name']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	const result = await contactService.query(filter, options);

	res.send(result);
};

export const getById = async (req, res) => {
	const contact = await contactService.getContactById(req.params.id);
	res.send(contact);
};

export const patchById = async (req, res) => {
	const contact = await contactService.updateContactById(
		req.params.id,
		req.body
	);
	res.send(contact);
};

export const removeById = async (req, res) => {
	await contactService.deleteContactById(req.params.id);
	res.status(200).send({ message: 'contact deleted' });
};

export const updateById = async (req, res) => {
	const contact = await contactService.updateContactById(
		req.params.id,
		req.body
	);
	res.send(contact);
};
