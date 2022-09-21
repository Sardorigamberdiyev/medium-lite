import { NextFunction } from 'express';
import { IPostDoc } from '../database/db.structure.interfaces';
import IUserRepository from '../users/users.repository.interface';
import postAddDto from './dto/post-add.dto';
import IPostIdDto from './dto/post-id.dto';
import postIdDto from './dto/post-id.dto';
import IPostListDto from './dto/post-list.dto';
import postUserDto from './dto/post-user.dto';
import IPostRepository from './posts.repository.interface';
import IPostService from './posts.service.interface';

export default class PostService implements IPostService {
    postRepository: IPostRepository;
    userRepository: IUserRepository;

    constructor(
        postRepository: IPostRepository,
        userRepository: IUserRepository
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    async createPost(dto: postAddDto, author: string): Promise<IPostDoc | null> {
        const user = await this.userRepository.findById(author);

        if (!user)
            return null
        
        const post = await this.postRepository.create(dto.title, dto.content, author);
        const userNewPosts = [...user.posts, post.id];

        await this.userRepository.updatePostById(author, userNewPosts);

        return post;
    }

    async getPostList(dto: IPostListDto): Promise<IPostDoc[]> {
        return await this.postRepository.findList(dto.skip, dto.limit);
    }

    async getPostById(dto: IPostIdDto): Promise<IPostDoc | null> {
        return await this.postRepository.findById(dto.postId);
    }

    async getUserPostList(dto: postUserDto, author: string): Promise<IPostDoc[]> {
        return await this.postRepository.findListByUser(author, dto.skip, dto.limit);
    }

    async postRead(dto: postIdDto, author: string): Promise<IPostDoc | null> {
        const readAt = new Date().toISOString();
        return await this.postRepository.findAndUpdateReadAt(dto.postId, author, readAt);
    }
}