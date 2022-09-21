import { Request, Response, NextFunction } from 'express';

export default interface IMiddleware {
    func: (req: Request, res: Response, next: NextFunction) => void;
}