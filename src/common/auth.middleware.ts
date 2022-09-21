import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import IMiddleware from './middleware.interface';

export default class AuthMiddleware implements IMiddleware {
    private secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    func(req: Request, res: Response, next: NextFunction): void {
        const auth = req.headers.authorization;

        if (!auth) 
            return next();

        const token = auth.split(' ')[1];
        // Проверка на валидность токена
        verify(token, this.secretKey, (err, payload) => {
            if (err)
                return next();

            if (payload && typeof payload !== 'string')
                req.user = payload.id;

            next();
        });
    }
}