import {Module} from "@nestjs/common";
import {BoardsController} from "./boards.controller";
import {BoardsService} from "./boards.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Boards} from "../entities/boards.entity";
import {Columns} from "../entities/columns.entity";
import {Cards} from "../entities/cards.entity";
import {Users} from "../entities/users.entity";
import {AuthService} from "../auth/auth.service";
import {Token} from "../entities/token.entity";
import {UsersModule} from "../user/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Boards, Columns, Cards, Users, Token]),
        UsersModule
    ],
    controllers: [BoardsController],
    providers: [BoardsService, AuthService]
})

export class BoardsModule {}