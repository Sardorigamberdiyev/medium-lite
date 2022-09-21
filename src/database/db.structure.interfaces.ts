export interface IUserDoc {
    id: string;
    email: string;
    password: string;
    posts: string[];
}

export interface IPostDoc {
    id: string;
    title: string;
    content: string;
    author: string;
    readAt: string;
}

export interface IDbStructure {
    users: IUserDoc[];
    posts: IPostDoc[];
}