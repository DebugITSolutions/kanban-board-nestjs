import {Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards} from "@nestjs/common";
import {BoardsService} from "./boards.service";
import {
    BoardAddCardDto,
    BoardAddColumnDto,
    BoardAddUserDto,
    BoardsCreateDto, ChangeBoardTitleDto, ChangeCardTitleDto, ChangeColumnTitleDto, DeleteBoardDto,
    DeleteCardDto, DeleteColumnDto, DeleteUserDto,
    MoveCardAtColumnDto
} from "./dto";
import {Response} from "express";
import {AuthGuard} from "../guard/auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('boards')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class BoardsController {
    constructor(
        private readonly boardsService: BoardsService,
    ) {
    }
    @Post('create')
    async createBoard(@Body() boardInfo: BoardsCreateDto) {
        return await this.boardsService.createNewBoard(boardInfo)
    }

    @Get('full-board/:board_id')
    async getBoard(@Param('board_id') id: number) {
        return await this.boardsService.getFullInfoBoardById(id)
    }

    @Get('all-boards/:user_id')
    async getAllBoard(@Param('user_id') user_id: number) {
        return await this.boardsService.getAllBoards(user_id)
    }

    @Put('add-user')
    async addUserAtBoard(@Body() data: BoardAddUserDto) {
        return this.boardsService.addUserAtBoard(data.user_id, data.board_id)
    }

    @Post('add-column')
    async addColumnAtBoard(@Body() data: BoardAddColumnDto) {
        const newColumn = this.boardsService.createNewColumn(data.columnTitle)
        return await this.boardsService.addColumnAtBoard(newColumn, data.board_id)
    }

    @Post('add-card')
    async addCardAtBoard(@Body() data: BoardAddCardDto) {
        const newCard = await this.boardsService.createNewCard(data.cardTitle)
        return this.boardsService.addCardAtColumn(data.column_id, newCard)
    }

    @Put('move-card')
    async moveCardAtColumn(@Body() data: MoveCardAtColumnDto) {
        return await this.boardsService.moveCardAtColumn(data.column_id, data.card_id)
    }

    @Put('change-board-title')
    async changeBoardTitle(@Body() data: ChangeBoardTitleDto) {
        return await this.boardsService.changeBoardTitle(data.board_id, data.board_title)
    }

    @Put('change-card-title')
    async changeCardTitle(@Body() data: ChangeCardTitleDto) {
        return await this.boardsService.changeCardTitle(data.card_id, data.card_title)
    }

    @Put('change-column-title')
    async changeColumnTitle(@Body() data: ChangeColumnTitleDto) {
        return await this.boardsService.changeColumnTitle(data.column_id, data.column_title)
    }

    @Delete('delete-card')
    async deleteCardAtColumn(@Body() data: DeleteCardDto) {
        return await this.boardsService.deleteCard(data.card_id)
    }

    @Delete('delete-column')
    async deleteColumnAtBoard(@Body() data: DeleteColumnDto, @Res() res: Response) {
        await this.boardsService.deleteColumn(data.column_id)
        return res.status(200).json('success')
    }

    @Delete('delete-board')
    async deleteBoard(@Res() res: Response, @Body() data: DeleteBoardDto) {
        await this.boardsService.deleteBoard(data.board_id)
        return res.status(200).json('success')
    }

    @Delete('delete-user')
    async deleteUsers(@Body() data: DeleteUserDto) {
        return this.boardsService.deleteUser(data.board_id, data.user_id)
    }
}