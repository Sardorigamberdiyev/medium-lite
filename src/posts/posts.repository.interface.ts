import { IPostDoc } from '../database/db.structure.interfaces';

type numberUndefined = number | undefined;

export default interface IPostRepository {
    create: (title: string, content: string, author: string) => Promise<IPostDoc>;
    findById: (id: string, author?: string) => Promise<IPostDoc | null>;
    findAndUpdateReadAt: (id: string, author: string, readAt: string) => Promise<IPostDoc | null>;
    findListByUser: (author: string, skip: numberUndefined, limit: numberUndefined) => Promise<IPostDoc[]>;
    findList: (skip: numberUndefined, limit: numberUndefined) => Promise<IPostDoc[]>;
}