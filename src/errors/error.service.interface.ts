import { Request, Response, NextFunction } from 'express';
import HttpError from './http-error';

export default interface IErrorService {
    errorHandler: (error: HttpError | Error, req: Request, res: Response, next: NextFunction) => void;
}