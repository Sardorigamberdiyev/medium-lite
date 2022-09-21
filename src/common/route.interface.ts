import { Request, Response, NextFunction } from 'express';
import IMiddleware from './middleware.interface';

export default interface IRoute {
    method: 'get' | 'post' | 'put';
    path: string;
    func: (req: Request<any, any, any, any>, res: Response, next: NextFunction) => Promise<void>;
    middlewares?: IMiddleware[];
    info?: string;
}