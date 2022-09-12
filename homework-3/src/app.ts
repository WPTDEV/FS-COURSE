import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { errorConverter, errorHandler } from './middlewares/error';
import contactsRouter from './routes/api/contacts';
import ApiError from './utils/apiError';

dotenv.config();

const { DB_HOST = 'mongodb://localhost:27017', PORT = 3000 } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
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
