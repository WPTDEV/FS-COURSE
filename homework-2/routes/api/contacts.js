import express from 'express';
import * as contactController from '../../controllers/contacts.js';
import { validate } from '../../middlewares/validate.js';
import ctrlWrapper from '../../utils/ctrlWrapper.js';
import * as contactValidation from '../../validation/contact.js';

const router = express.Router();

router
	.route('/')
	.post(
		validate(contactValidation.createContact),
		ctrlWrapper(contactController.add)
	)
	.get(
		validate(contactValidation.getContacts),
		ctrlWrapper(contactController.getAll)
	);

router
	.route('/:id')
	.get(
		validate(contactValidation.getContact),
		ctrlWrapper(contactController.getById)
	)
	.put(
		validate(contactValidation.updateContact),
		ctrlWrapper(contactController.updateById)
	)
	.delete(
		validate(contactValidation.deleteContact),
		ctrlWrapper(contactController.removeById)
	);

router.patch(
	'/:id/favorite',
	validate(contactValidation.favorite),
	ctrlWrapper(contactController.patchById)
);

export default router;
