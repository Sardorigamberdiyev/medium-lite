import { Request, Response, NextFunction } from 'express';
import IPostAddDto from './dto/post-add.dto';
import IPostIdDto from './dto/post-id.dto';
import IPostListDto from './dto/post-list.dto';
import IPostUserDto from './dto/post-user.dto';

export default interface IPostController {
    postAdd: (req: Request<{}, {}, IPostAddDto>, res: Response, next: NextFunction) => Promise<void>;
    postList: (req: Request<{}, {}, {}, IPostListDto>, res: Response, next: NextFunction) => Promise<void>;
    postById: (req: Request<IPostIdDto>, res: Response, next: NextFunction) => Promise<void>;
    postUserById: (req: Request<IPostIdDto>, res: Response, next: NextFunction) => Promise<void>;
    postUser: (req: Request<{}, {}, {}, IPostUserDto>, res: Response, next: NextFunction) => Promise<void>;
}