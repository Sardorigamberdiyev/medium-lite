import { IUserDoc } from '../database/db.structure.interfaces';
import IUserListDto from './dto/user-list.dto';
import IUserLoginDto from './dto/user-login.dto';
import IUserRegisterDto from './dto/user-register.dto';

export default interface IUserService {
    createUser: (dto: IUserRegisterDto) => Promise<IUserDoc | null>;
    userValidate: (dto: IUserLoginDto) => Promise<IUserDoc | null>;
    getUserList: (dto: IUserListDto) => Promise<IUserDoc[]>;
}