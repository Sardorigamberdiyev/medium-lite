import { IUserDoc } from '../database/db.structure.interfaces';
import IUserRepository from './users.repository.interface';
import UserModel from '../database/models/user.model';

export default class UserRepository implements IUserRepository {
    public async create(email: string, password: string): Promise<IUserDoc> {
        return await new UserModel(email, password).save();
    }

    public async findByEmail(email: string): Promise<IUserDoc | null> {
        return await UserModel.findOne({email});
    }

    public async findById(id: string): Promise<IUserDoc | null> {
        return await UserModel.findOne({id});
    }

    public async getList(skip: number, limit: number): Promise<IUserDoc[]> {
        return await UserModel.find({}, {skip, limit});
    }

    public async updatePostById(id: string, posts: string[]): Promise<IUserDoc> {
        return await UserModel.updateOne({id}, {posts});
    }
}