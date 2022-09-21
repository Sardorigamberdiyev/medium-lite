import { v4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

import { IDbStructure, IPostDoc } from '../db.structure.interfaces';
import IModel from './model.interface';

type findOneFilter = {
    id?: string;
    author?: string;
}

type findFilter = {
    author?: string;
    title?: string;
}

type methodName = 'find' | 'findIndex' | 'filter';

type paginationOption = {
    skip?: number;
    limit?: number;
}

export default class PostModel implements IModel<IPostDoc>, IPostDoc {
    public id: string;
    public title: string;
    public content: string;
    public author: string;
    public readAt: string;
    private pathToDbFile: string;
    private static pathToDbFile: string;

    constructor(title: string, content: string, author: string) {
        this.id = v4();
        this.title = title;
        this.content = content;
        this.author = author;
        this.readAt = new Date().toISOString();
        this.pathToDbFile = path.join(__dirname, '..', 'medium.db.json');
    }

    public async save(): Promise<IPostDoc> {
        const result = await fs.readFile(this.pathToDbFile);
        const data: IDbStructure = JSON.parse(result.toString());

        const post = {
            id: this.id,
            title: this.title,
            content: this.content,
            author: this.author,
            readAt: this.readAt
        };

        if (Array.isArray(data.posts) && data) {
            data.posts.push(post);
            await fs.writeFile(this.pathToDbFile, JSON.stringify(data));
            return post;
        }

        throw new Error('Не правильно формирован структура дб');
    }

    static {
        this.pathToDbFile = path.join(__dirname, '..', 'medium.db.json');
    }

    public static async findOne(filter: findOneFilter): Promise<IPostDoc | null> {
        const result = await fs.readFile(this.pathToDbFile);
        const data: IDbStructure = JSON.parse(result.toString());

        if (Array.isArray(data.posts) && data) {
            const post = data.posts.find(this.withMethodCbByFilter(filter, 'find'));

            if (!post)
                return null;

            return post
        }

        throw new Error('Не правильно формирован структура дб');
    }

    public static async find(filter: findFilter, {skip, limit}: paginationOption): Promise<IPostDoc[]> {
        const result = await fs.readFile(this.pathToDbFile);
        const data: IDbStructure = JSON.parse(result.toString());

        if (Array.isArray(data.posts) && data) {
            const filteredPosts = data.posts.filter(this.withMethodCbByFilter(filter, 'filter'));

            // Пагинация
            const skipLimit = skip && limit ? skip + limit : undefined;
            const posts = filteredPosts.slice(skip, skipLimit);
            return posts;
        }

        throw new Error('Не правильно формирован структура дб');
    }

    public static async updateReadAt(filter: findOneFilter, updateReadAt: string): Promise<IPostDoc | null> {
        const result = await fs.readFile(this.pathToDbFile);
        const data: IDbStructure = JSON.parse(result.toString());

        if (Array.isArray(data.users) && data) {
            const postIdx = data.posts.findIndex(this.withMethodCbByFilter(filter, 'findIndex'));

            if (postIdx < 0)
                return null;

            data.posts[postIdx].readAt = updateReadAt;

            await fs.writeFile(this.pathToDbFile, JSON.stringify(data));
            
            return data.posts[postIdx];
        }

        throw new Error('Не правильно формирован структура дб');
    }

    // Это метод для того чтобы избежать код копирование
    private static withMethodCbByFilter(filter: findFilter | findOneFilter, methodName: methodName) {
        const { author } = filter;
        return (p: IPostDoc): boolean => {
            const isAuthor = p.author === author;
            if ('id' in filter) {
                const { id } = filter;
                // если запрос по author
                if (author && !id)
                    return isAuthor;

                // если запрос по id
                if (!author && id)
                    return p.id === id;
                
                // запрос по id и author
                if (author && id)
                    return p.id === id && isAuthor;

            } else if ('title' in filter) {
                const { title } = filter;
                // если запрос по author
                if (author && !title)
                    return isAuthor;
                
                // если запрос по title
                if (!author && title)
                    return p.id === title;

                // если запрос по author и title
                if (author && title)
                    return p.id === title && isAuthor;
            } else if (author) 
                return isAuthor;

            return methodName === 'filter' ? true : false;
        }
    }
}