import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { errorConverter, errorHandler } from './middlewares/error.js';
import contactsRouter from './routes/api/contacts.js';
import ApiError from './utils/ApiError.js';

dotenv.config();

const { DB_HOST, PORT = 3000 } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

mongoose
	.connect(DB_HOST)
	.then(() => app.listen(PORT))
	.catch((error) => {
		console.log(error.message);
		process.exit(1);
	});
