export default class ApiError extends Error {
	statusCode = 200;
	isOperational = true;

	constructor(statusCode: number, message: string, isOperational = true, stack = '') {
		super(message);

		this.statusCode = statusCode;
		this.isOperational = isOperational;

		stack
			? (this.stack = stack)
			: Error.captureStackTrace(this, this.constructor);
	}
}
