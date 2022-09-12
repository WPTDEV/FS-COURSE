import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';

export const errorConverter = (error: Error, req: Request, res: Response, next: NextFunction) => {
	if (!(error instanceof ApiError)) {
		error = new ApiError(httpStatus.BAD_REQUEST, error.message, false, error.stack);
	}

	next(error);
};

export const errorHandler = (error: ApiError, req: Request, res: Response, next: NextFunction) => {
	let { statusCode, message } = error;

	if (process.env.NODE_ENV === 'production' && !error.isOperational) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR].toString();
	}

	res.locals.errorMessage = error.message;

	const response = {
		code: statusCode,
		message,
		...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
	};

	res.status(statusCode).send(response);
};
