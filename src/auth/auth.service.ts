import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {CreateUserDto} from "../user/dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Token} from "../entities/token.entity";
import {UsersService} from "../user/users.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    generateTokens(userData: CreateUserDto) {
        const accessToken = this.jwtService.sign({email: userData.email, name: userData.name}, {expiresIn: "1d"})
        const refreshToken = this.jwtService.sign({email: userData.email, name: userData.name}, {expiresIn: "30d"})
        return {accessToken, refreshToken}
    }

    verifyToken(token: string) {
        try {
            if (!token) {
                return new UnauthorizedException('Пользователь не авторизован')
            }
            return this.jwtService.verify(token)
        } catch(e) {
            throw new UnauthorizedException()
        }

    }

    async saveToken(email: string, token: string) {
        if (!token) {
            return new BadRequestException('Токен не найден')
        }
        const user = await this.usersService.getUserByEmail(email)
        const currentToken = await this.tokenRepository.findOne({ where: { user: user } });
        if (currentToken) {
            await this.tokenRepository.delete(currentToken.id);
        }

        await this.tokenRepository.save({user, token})
    }
}