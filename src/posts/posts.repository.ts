import { IPostDoc } from '../database/db.structure.interfaces';
import PostModel from '../database/models/post.model';
import IPostRepository from './posts.repository.interface';

export default class PostRepository implements IPostRepository {
    public async create(title: string, content: string, author: string): Promise<IPostDoc> {
        return await new PostModel(title, content, author).save();
    }

    public async findById(id: string, author?: string): Promise<IPostDoc | null> {
        return await PostModel.findOne({id, author});
    }

    public async findList(skip: number | undefined, limit: number | undefined): Promise<IPostDoc[]> {
        return await PostModel.find({}, {skip, limit});
    }
    
    public async findAndUpdateReadAt(id: string, author: string, readAt: string): Promise<IPostDoc | null> {
        return await PostModel.updateReadAt({id, author}, readAt);
    }

    public async findListByUser(author: string, skip: number | undefined, limit: number | undefined): Promise<IPostDoc[]> {
        return await PostModel.find({author}, {skip, limit});
    }

}