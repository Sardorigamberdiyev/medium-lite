import { Request, Response, NextFunction } from 'express';
import AuthGuardMiddleware from '../common/auth.guard.middleware';
import BaseController from '../common/base.controller';
import ValidatorMiddleware from '../common/validator.middleware';
import HttpError from '../errors/http-error';
import IPostAddDto from './dto/post-add.dto';
import IPostIdDto from './dto/post-id.dto';
import IPostListDto from './dto/post-list.dto';
import IPostUserDto from './dto/post-user.dto';
import IPostController from './posts.controller.interface';
import IPostService from './posts.service.interface';
import addValidator from './validators/post-add.validator';

export default class PostController extends BaseController implements IPostController {
    postService: IPostService;

    constructor(postService: IPostService) {
        super();
        this.postService = postService;
        this.bindRoutes([
            {
                method: 'get',
                path: '/',
                func: this.postList,
                info: '/api/post\n query: { skip: number, limit: number }\n auth: no'
            },
            {
                method: 'get',
                path: '/user',
                func: this.postUser,
                middlewares: [new AuthGuardMiddleware()],
                info: '/api/post/user\n query: { skip: number, limit: number }\n auth: yes'
            },
            {
                method: 'get',
                path: '/:postId',
                func: this.postById,
                info: '/api/post/:postId\n query: { skip: number, limit: number }\n auth: no'
            },
            {
                method: 'get',
                path: '/user/:postId',
                func: this.postUserById,
                middlewares: [new AuthGuardMiddleware()],
                info: '/api/post/user/:postId\n param: { postId: string }\n auth: yes'
            },
            {
                method: 'post',
                path: '/add',
                func: this.postAdd,
                middlewares: [
                    new AuthGuardMiddleware(), 
                    new ValidatorMiddleware<IPostAddDto>(addValidator)
                ],
                info: '/api/post/add\n body: { title: string, content: string }\n auth: yes'
            }
        ]);
    }

    public async postAdd(req: Request<{}, {}, IPostAddDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.postService.createPost(req.body, req.user);

        if (!result)
            return next(new HttpError(404, 'Нет такого пользователя'));

        res.status(201).json({message: 'Вы успешно добавили пост'});
    }

    public async postList(req: Request<{}, {}, {}, IPostListDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.postService.getPostList(req.query);
        res.status(200).json({posts: result});
    }

    public async postById(req: Request<IPostIdDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.postService.getPostById(req.params);
        res.status(200).json({post: result});
    }

    public async postUserById(req: Request<IPostIdDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.postService.postRead(req.params, req.user);

        if (!result)
            return next(new HttpError(404, 'У вас нет такого поста или был удален'));
            
        res.status(200).json({post: result});
    }

    public async postUser(req: Request<{}, {}, {}, IPostUserDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.postService.getUserPostList(req.query, req.user);
        res.status(200).json({posts: result});
    }
}