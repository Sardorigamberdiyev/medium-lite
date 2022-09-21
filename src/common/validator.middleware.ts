import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import HttpError from '../errors/http-error';
import IMiddleware from './middleware.interface';

export default class ValidatorMiddleware<DTO = {}> implements IMiddleware {
    private joiSchema: ObjectSchema<DTO>;
    
    constructor(joiSchema: ObjectSchema<DTO>) {
        this.joiSchema = joiSchema;
    }

    func(req: Request<{}, {}, DTO>, res: Response, next: NextFunction): void {
        this.joiSchema
        .validateAsync(req.body)
        .then(() => next())
        .catch((err) => {
            if (err instanceof Error)
                next(new HttpError(400, err.message))
        });
    }
}