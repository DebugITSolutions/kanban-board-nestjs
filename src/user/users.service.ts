import {BadRequestException, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {Users} from "../entities/users.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {PasswordService} from "../auth/password.service";
import {CreateUserDto} from "./dto";
import {Token} from "../entities/token.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private readonly passwordService: PasswordService,
    ) {}
    async createUser(userData: CreateUserDto) {
        const newUser = this.userRepository.create(userData);
        const passwordHash = this.passwordService.generateHashPassword(userData.password)
        await this.userRepository.save({...newUser, password: passwordHash})
        return {...newUser, password: ""}
    }

    async getUserByEmail(email: string) {
        try {
            return await this.userRepository.findOne({where: {email}})
        } catch (e) {
            return e
        }
    }

    async signOut(email: string) {
        if (!email) {
            throw new BadRequestException()
        }
        const user = await this.getUserByEmail(email)
        if (!user) {
            throw new BadRequestException()
        }
        await this.tokenRepository.delete(user.id)
    }
}