import express, { Express } from 'express';
import { json } from 'body-parser';
import IBaseController from './common/base.controller.interface';
import IErrorService from './errors/error.service.interface';
import IUserController from './users/users.controller.interface';
import IPostController from './posts/posts.controller.interface';
import IConfigService from './config/config.service.interface';
import AuthMiddleware from './common/auth.middleware';

export default class App {
    private app: Express;
    private port: number;
    private errorService: IErrorService;
    private configService: IConfigService;
    private userController: IUserController & IBaseController;
    private postController: IPostController & IBaseController;

    constructor(
        configService: IConfigService,
        errorService: IErrorService, 
        userController: IUserController & IBaseController,
        postController: IPostController & IBaseController
    ) {
        this.port = 5000;
        this.app = express();
        this.configService = configService;
        this.errorService = errorService;
        this.userController = userController;
        this.postController = postController;
    }

    private useMiddleware(): void {
        this.app.use(json());
        const authMiddleware = new AuthMiddleware(this.configService.get('JWT_SECRET'));
        this.app.use(authMiddleware.func.bind(authMiddleware));
    }

    private useRoutes(): void {
        this.app.use('/api/user', this.userController.router);
        this.app.use('/api/post', this.postController.router);
    }

    private useCatch(): void {
        this.app.use(this.errorService.errorHandler);
    }

    public async start(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useCatch();
        this.app.listen(this.port, () => console.log(`[СЕРВЕР]: Запустился на порте ${this.port}`))
    }
}