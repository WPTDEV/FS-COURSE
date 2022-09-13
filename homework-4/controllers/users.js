import * as userService from '../services/users.js';
import { pick } from '../utils/pick.js';

export const add = async (req, res) => {
	const user = await userService.create(req.body);
	res.status(201).send(user);
};

export const getAll = async (req, res) => {
	const filter = pick(req.query, ['name']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	const result = await userService.query(filter, options);

	res.send(result);
};

export const getById = async (req, res) => {
	const users = await userService.getById(req.params.id);
	res.send(users);
};

export const patchById = async (req, res) => {
	const user = await userService.updateById(req.params.id, req.body);
	res.send(user);
};

export const removeById = async (req, res) => {
	await userService.deleteById(req.params.id);
	res.status(200).send({ message: 'user deleted' });
};

export const updateById = async (req, res) => {
	const user = await userService.updateById(req.params.id, req.body);
	res.send(user);
};
