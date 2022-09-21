import { hash, compare } from 'bcryptjs';
import { IUserDoc } from '../database/db.structure.interfaces';
import IUserListDto from './dto/user-list.dto';
import userLoginDto from './dto/user-login.dto';
import IUserRegisterDto from './dto/user-register.dto';
import IUserRepository from './users.repository.interface';
import IUserService from './users.service.interface';

export default class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(dto: IUserRegisterDto): Promise<IUserDoc | null> {
        const condidate = await this.userRepository.findByEmail(dto.email);
        if (condidate)
            return null;

        const hashPassword = await hash(dto.password, 12);
        return await this.userRepository.create(dto.email, hashPassword);
    }

    async userValidate(dto: userLoginDto): Promise<IUserDoc | null> {
        const currentUser = await this.userRepository.findByEmail(dto.email);
        if (!currentUser)
            return null;

        const isMatch = await compare(dto.password, currentUser.password);
        if (!isMatch)
            return null;

        return currentUser;
    }

    async getUserList(dto: IUserListDto): Promise<IUserDoc[]> {
        return await this.userRepository.getList(dto.skip, dto.limit);
    }
}