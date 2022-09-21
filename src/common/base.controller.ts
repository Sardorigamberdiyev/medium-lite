import { Router } from 'express';
import IBaseController from './base.controller.interface';
import IRoute from './route.interface';

export default class BaseController implements IBaseController {
    private _router: Router;

    constructor() {
        this._router = Router();
    }

    get router(): Router {
        return this._router;
    }

    protected bindRoutes(routes: IRoute[]): void {
        for (const route of routes) {
            if (route.middlewares) {
                const middlewares = route.middlewares.map((m) => m.func.bind(m));
                this._router[route.method](route.path, middlewares, route.func.bind(this));
            } else
                this._router[route.method](route.path, route.func.bind(this));
            
            console.log(`[${route.method.toLocaleUpperCase()}]: ${route.info || route.path}`);
        }
    }
}