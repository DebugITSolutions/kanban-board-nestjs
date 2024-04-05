import {Body, Controller, Get, Param, Post, Put} from "@nestjs/common";
import {BoardsService} from "./boards.service";
import {BoardAddCardDto, BoardAddColumnDto, BoardAddUserDto, BoardsCreateDto, MoveCardAtColumnDto} from "./dto";

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {
    }
    @Post('create')
    async createBoard(@Body() boardInfo: BoardsCreateDto) {
        try {
            return await this.boardsService.createNewBoard(boardInfo)
        } catch (e) {
            return e.message
        }
    }

    @Get('full-board/:id')
    async getBoard(@Param('id') id: number) {
        try {
            return await this.boardsService.getFullInfoBoardById(id)
        } catch (e) {
            return e.message
        }

    }

    @Put('add-user')
    async addUserAtBoard(@Body() data: BoardAddUserDto) {

    }

    @Put('add-column')
    async addColumnAtBoard(@Body() data: BoardAddColumnDto) {
        try {
            const newColumn = this.boardsService.createNewColumn(data.columnTitle)
            return await this.boardsService.addColumnAtBoard(newColumn, data.board_id)
        } catch(e) {
            return e.message
        }
    }

    @Put('add-card')
    async addCardAtBoard(@Body() data: BoardAddCardDto) {
        try {
            const newCard = await this.boardsService.createNewCard(data.cardTitle)
            return this.boardsService.addCardAtColumn(data.column_id, newCard)
        } catch (e) {
            return e.message
        }
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