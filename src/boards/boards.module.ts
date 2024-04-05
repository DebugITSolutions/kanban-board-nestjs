import {Module} from "@nestjs/common";
import {BoardsController} from "./boards.controller";
import {BoardsService} from "./boards.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Boards} from "../entities/boards.entity";
import {Columns} from "../entities/columns.entity";
import {Cards} from "../entities/cards.entity";
import {Users} from "../entities/users.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Boards, Columns, Cards, Users])
    ],
    controllers: [BoardsController],
    providers: [BoardsService]
})

export class BoardsModule {}