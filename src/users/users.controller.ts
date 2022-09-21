import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import BaseController from '../common/base.controller';
import IConfigService from '../config/config.service.interface';
import HttpError from '../errors/http-error';
import IUserListDto from './dto/user-list.dto';
import IUserLoginDto from './dto/user-login.dto';
import IUserRegisterDto from './dto/user-register.dto';
import IUserController from './users.controller.interface';
import IUserService from './users.service.interface';
import ValidatorMiddleware from '../common/validator.middleware';
import registerValidater from './validators/user-register.validator';

export default class UserController extends BaseController implements IUserController {
    private userService: IUserService;
    private configService: IConfigService;

    constructor(userService: IUserService, configService: IConfigService) {
        super();
        this.userService = userService;
        this.configService = configService;
        this.bindRoutes(
            [
                {
                    method: 'post',
                    path: '/register',
                    func: this.register,
                    middlewares: [new ValidatorMiddleware<IUserRegisterDto>(registerValidater)],
                    info: `/api/user/register\n body: { email: string, password: string }\n auth: no`
                },
                {
                    method: 'post',
                    path: '/login',
                    func: this.login,
                    info: `/api/user/login\n body: { email: string, password: string }\n auth: no`
                },
                {
                    method: 'get',
                    path: '/list',
                    func: this.userList,
                    info: `/api/user/list\n query: { skip: number, limit: number }\n auth: no`
                }
            ]
        );
    }

    public async register(req: Request<{}, {}, IUserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.createUser(req.body);
        if (!result)
            return next(new HttpError(422, 'Пользователь с таки email уже сущ.'));

        res.status(201).json({message: 'Вы успешно зарегестрировались'});
    }

    public async login(req: Request<{}, {}, IUserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.userValidate(req.body);
        if (!result)
            return next(new HttpError(400, 'Не верный email или пароль'));

        const token = sign({id: result.id}, this.configService.get('JWT_SECRET'));

        res.status(200).json({token});
    }

    public async userList(req: Request<{}, {}, {}, IUserListDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.getUserList(req.query);
        res.status(200).json({users: result});
    }
}