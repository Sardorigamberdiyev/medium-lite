import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/http-error';
import IMiddleware from './middleware.interface';

export default class AuthGuardMiddleware implements IMiddleware {
    func(req: Request, res: Response, next: NextFunction): void {
        if (!req.user)
            return next(new HttpError(401, 'Вы не автаризованы'));
        next();
    }
}