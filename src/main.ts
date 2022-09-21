import App from './app';
import ConfigService from './config/config.service';
import ErrorService from './errors/error.service';
import PostController from './posts/posts.controller';
import PostRepository from './posts/posts.repository';
import PostService from './posts/posts.service';
import UserController from './users/users.controller';
import UserRepository from './users/users.repository';
import UserService from './users/users.service';

const configService = new ConfigService();
const app = new App(
    configService,
    new ErrorService(), 
    new UserController(new UserService(new UserRepository()), configService),
    new PostController(new PostService(new PostRepository(), new UserRepository()))
);
app.start();