import { Request, Response } from 'express';
import * as contactService from '../services/contacts';
import { pick } from '../utils/pick';

export const add = async (req: Request, res: Response) => {
	const contact = await contactService.create(req.body);
	res.status(201).send(contact);
};

export const getAll = async (req: Request, res: Response) => {
	const filter = pick(req.query, ['name']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	const result = await contactService.query(filter, options);

	res.send(result);
};

export const getById = async (req: Request, res: Response) => {
	const contact = await contactService.getContactById(req.params.id);
	res.send(contact);
};

export const patchById = async (req: Request, res: Response) => {
	const contact = await contactService.updateContactById(
		req.params.id,
		req.body
	);
	res.send(contact);
};

export const removeById = async (req: Request, res: Response) => {
	await contactService.deleteContactById(req.params.id);
	res.status(200).send({ message: 'contact deleted' });
};

export const updateById = async (req: Request, res: Response) => {
	const contact = await contactService.updateContactById(
		req.params.id,
		req.body
	);
	res.send(contact);
};
