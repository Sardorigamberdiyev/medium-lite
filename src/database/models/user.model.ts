import fs from 'fs/promises';
import path from 'path';
import { v4 } from 'uuid';
import { IDbStructure, IUserDoc } from '../db.structure.interfaces';
import IModel from './model.interface';

type userFilter = {
    id?: string;
    email?: string;
};

type paginationOption = {
    skip?: number;
    limit?: number;
};

type updateData = {
    email?: string;
    posts?: string[];
};

type methodName = 'find' | 'findIndex' | 'filter';

export default class UserModel implements IModel<IUserDoc> {
    public id: string;
    public email: string;
    public password: string;
    public posts: string[];
    private pathToDbFile: string;
    private static pathToDbFile: string;

    constructor(email: string, password: string) {
        this.id = v4();
        this.email = email;
        this.password = password;
        this.posts = [];
        this.pathToDbFile = path.join(__dirname, '..', 'medium.db.json');
    }

    
    public async save(): Promise<IUserDoc> {
        const result = await fs.readFile(this.pathToDbFile);
        const data: IDbStructure = JSON.parse(result.toString());

        const user: IUserDoc = {
            id: this.id,
            email: this.email,
            password: this.password,
            posts: []
        };

        if (Array.isArray(data.users) && data) {
            data.users.push(user);
            await fs.writeFile(this.pathToDbFile, JSON.stringify(data));
            return user;
        }

        throw new Error('Не правильно формирован структура дб');
    }
    
    static {
        this.pathToDbFile = path.join(__dirname, '..', 'medium.db.json');
    }

    public static async findOne(filter: userFilter): Promise<IUserDoc | null> {
        const result = await fs.readFile(this.pathToDbFile);
        const data: IDbStructure = JSON.parse(result.toString());

        if (Array.isArray(data.users) && data) {
            // Ишем пользователя по заданному фильтру filter
            const user = data.users.find(this.withMethodCbByFilter(filter, 'find'));

            // если пользовател суш. то его вернем а так вернем null
            if (user)
                return user;

            return null;
        }

        throw new Error('Не правильно формирован структура дб');
    }

    public static async find(filter: userFilter, {skip, limit}: paginationOption): Promise<IUserDoc[]> {
        const result = await fs.readFile(this.pathToDbFile);
        const data: IDbStructure = JSON.parse(result.toString());

        if (Array.isArray(data.users) && data) {
            // Ишем пользователя по заданному фильтру filter
            const filteredUsers = data.users.filter(this.withMethodCbByFilter(filter, 'filter'));

            // Пагинация
            const skipLimit = skip && limit ? skip + limit : undefined;
            const users = filteredUsers.slice(skip, skipLimit);

            // вернем сортированный массив
            return users;
        }

        throw new Error('Не правильно формирован структура дб');
    }

    public static async updateOne(filter: userFilter, updateData: updateData): Promise<IUserDoc> {
        const result = await fs.readFile(this.pathToDbFile);
        const data: IDbStructure = JSON.parse(result.toString());

        if (Array.isArray(data.users) && data) {
            const userIdx = data.users.findIndex(this.withMethodCbByFilter(filter, 'findIndex'));

            if (userIdx < 0)
                throw new Error('Такой прльзователь в бд не сущ.');

            let user = data.users[userIdx];
            user = {...user, ...updateData};
            data.users[userIdx] = user;

            await fs.writeFile(this.pathToDbFile, JSON.stringify(data));
            
            return user;
        }

        throw new Error('Не правильно формирован структура дб');
    }

    // Это метод для того чтобы избежать код копирование
    private static withMethodCbByFilter(filter: userFilter, methodName: methodName): (u: IUserDoc) => boolean {
        return (u: IUserDoc): boolean => {
            if (filter.email && !filter.id)
            return u.email === filter.email;
        
            if (!filter.email && filter.id)
                return u.id === filter.id;

            if (filter.email && filter.id)
                return u.id === filter.id && u.email === filter.email

            return methodName === 'filter' ? true : false;
        }
    }
}