import { Request, Response, NextFunction } from 'express';
import IErrorService from './error.service.interface';
import HttpError from './http-error';


export default class ErrorService implements IErrorService {
    errorHandler(error: HttpError | Error, req: Request, res: Response, next: NextFunction): void {
        if (error instanceof HttpError)
            res.status(error.statusCode).json({message: error.message});
        else
            res.status(500).json(`[ОШИБКА]: ${error.message}`);
    }
}