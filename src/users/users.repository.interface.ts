import { IUserDoc } from '../database/db.structure.interfaces';

export default interface IUserRepository {
    create: (email: string, password: string) => Promise<IUserDoc>;
    findByEmail: (email: string) => Promise<IUserDoc | null>;
    findById: (id: string) => Promise<IUserDoc | null>;
    getList: (skip: number, limit: number) => Promise<IUserDoc[]>;
    updatePostById: (id: string, posts: string[]) => Promise<IUserDoc>;
}