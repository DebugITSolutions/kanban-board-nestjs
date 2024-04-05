import {Body, Controller, Get, Param, Post, Put} from "@nestjs/common";
import {BoardsService} from "./boards.service";
import {BoardAddCardDto, BoardAddColumnDto, BoardAddUserDto, BoardsCreateDto, MoveCardAtColumnDto} from "./dto";

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {
    }
    @Post('create')
    async createBoard(@Body() boardInfo: BoardsCreateDto) {
        return await this.boardsService.createNewBoard(boardInfo)
    }

    @Get('full-board/:id')
    async getBoard(@Param('id') id: number) {
        return await this.boardsService.getFullInfoBoardById(id)
    }

    @Put('add-user')
    async addUserAtBoard(@Body() data: BoardAddUserDto) {

    }

    @Put('add-column')
    async addColumnAtBoard(@Body() data: BoardAddColumnDto) {

    }

    @Put('add-card')
    async addCardAtBoard(@Body() data: BoardAddCardDto) {

    }

    @Put('move-card')
    async moveCardAtColumn(@Body() data: MoveCardAtColumnDto) {

    }

    @Put('delete-card')
    async deleteCardAtColumn(@Body() card_id: number) {

    }

    @Put('delete-column')
    async deleteColumnAtBoard(@Body() column_id: number) {

    }

    @Put('delete-board')
    async deleteBoard(@Body() board_id: number) {

    }
}