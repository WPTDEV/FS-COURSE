import { NextFunction, Request, Response } from 'express';

const ctrlWrapper = (ctrl: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => {
	Promise.resolve(ctrl(req, res, next)).catch((err) => next(err));
};

export default ctrlWrapper;
