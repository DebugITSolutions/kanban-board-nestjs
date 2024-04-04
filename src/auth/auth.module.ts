import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../entities/users.entity";
import {PasswordService} from "./password.service";
import {UsersService} from "../user/users.service";
import {Token} from "../entities/token.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, Token]),
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, PasswordService],
    exports: [PasswordService, AuthService],
})

export class AuthModule {

}