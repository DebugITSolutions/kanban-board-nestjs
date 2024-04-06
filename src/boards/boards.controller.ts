import {Body, Controller, Get, Param, Post, Put, Res} from "@nestjs/common";
import {BoardsService} from "./boards.service";
import {
    BoardAddCardDto,
    BoardAddColumnDto,
    BoardAddUserDto,
    BoardsCreateDto, DeleteBoardDto,
    DeleteCardDto,
    MoveCardAtColumnDto
} from "./dto";
import {Response} from "express";

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
        return this.boardsService.addUserAtBoard(data.user_id, data.board_id)
    }

    @Put('add-column')
    async addColumnAtBoard(@Body() data: BoardAddColumnDto) {
        const newColumn = this.boardsService.createNewColumn(data.columnTitle)
        return await this.boardsService.addColumnAtBoard(newColumn, data.board_id)
    }

    @Put('add-card')
    async addCardAtBoard(@Body() data: BoardAddCardDto) {
        const newCard = await this.boardsService.createNewCard(data.cardTitle)
        return this.boardsService.addCardAtColumn(data.column_id, newCard)
    }

    @Put('move-card')
    async moveCardAtColumn(@Body() data: MoveCardAtColumnDto) {
        return await this.boardsService.moveCardAtColumn(data.column_id, data.card_id)
    }

    @Put('delete-card')
    async deleteCardAtColumn(@Body() data: DeleteCardDto) {
        return await this.boardsService.deleteCard(data.card_id)
    }

    @Put('delete-column')
    async deleteColumnAtBoard(@Body() column_id: number) {

    }

    @Put('delete-board')
    async deleteBoard(@Res() res: Response, @Body() data: DeleteBoardDto) {
        await this.boardsService.deleteBoard(data.board_id)
        return res.status(200).json('success')
    }
}