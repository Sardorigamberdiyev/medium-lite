import { Request, Response, NextFunction } from 'express';
import IUserListDto from './dto/user-list.dto';
import IUserLoginDto from './dto/user-login.dto';
import IUserRegisterDto from './dto/user-register.dto';

export default interface IUserController {
    login: (req: Request<{}, {}, IUserRegisterDto>, res: Response, next: NextFunction) => Promise<void>;
    register: (req: Request<{}, {}, IUserLoginDto>, res: Response, next: NextFunction) => Promise<void>;
    userList: (req: Request<{}, {}, {}, IUserListDto>, res: Response, next: NextFunction) => Promise<void>;
}