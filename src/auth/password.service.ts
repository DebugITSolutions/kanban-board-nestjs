import {BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {pbkdf2Sync} from 'crypto'
import {UsersService} from "../user/users.service";
@Injectable()
export class PasswordService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService
    ) {}
    generateHashPassword(password: string): string | undefined {
        return pbkdf2Sync(password, "10", 1000, 64,'sha512').toString('hex')
    }

    async verifyPassword(email: string, password: string) {
        const inputPass = this.generateHashPassword(password);
        const user = await this.usersService.getUserByEmail(email);

        if (!user) {
            throw new BadRequestException('Пользователь не найден');
        }

        if (inputPass !== user.password) {
            throw new UnauthorizedException('Неверный пароль');
        }

        return true;
    }
}