import {Module} from "@nestjs/common";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../entities/users.entity";
import {PasswordService} from "../auth/password.service";
import {AuthService} from "../auth/auth.service";
import {Token} from "../entities/token.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, Token])
    ],
    controllers: [UsersController],
    providers: [UsersService, PasswordService, AuthService],
    exports: [UsersService],
})

export class UsersModule {}
