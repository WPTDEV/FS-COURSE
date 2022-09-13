import express from 'express';
import * as userController from '../../controllers/users.js';
import { validate } from '../../middlewares/validate.js';
import ctrlWrapper from '../../utils/ctrlWrapper.js';
import * as userValidation from '../../validation/user.js';

const router = express.Router();

router
	.route('/')
	.post(validate(userValidation.createContact), ctrlWrapper(userController.add))
	.get(
		validate(userValidation.getContacts),
		ctrlWrapper(userController.getAll)
	);

router
	.route('/:id')
	.get(validate(userValidation.getContact), ctrlWrapper(userController.getById))
	.put(
		validate(userValidation.updateContact),
		ctrlWrapper(userController.updateById)
	)
	.delete(
		validate(userValidation.deleteContact),
		ctrlWrapper(userController.removeById)
	);

export default router;
