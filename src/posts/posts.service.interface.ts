import { IPostDoc } from '../database/db.structure.interfaces';
import IPostAddDto from './dto/post-add.dto';
import IPostIdDto from './dto/post-id.dto';
import IPostListDto from './dto/post-list.dto';
import IPostUserDto from './dto/post-user.dto';

export default interface IPostService {
    createPost: (dto: IPostAddDto, author: string) => Promise<IPostDoc | null>;
    getPostList: (dto: IPostListDto) => Promise<IPostDoc[]>;
    getPostById: (dto: IPostIdDto) => Promise<IPostDoc | null>;
    getUserPostList: (dto: IPostUserDto, author: string) => Promise<IPostDoc[]>;
    postRead: (dto: IPostIdDto, author: string) => Promise<IPostDoc | null>;
}