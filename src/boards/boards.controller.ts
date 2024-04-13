import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards} from "@nestjs/common";
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
        try {
            return await this.boardsService.createNewBoard(boardInfo)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Get('full-board/:board_id')
    async getBoard(@Param('board_id') id: number) {
        try {
            return await this.boardsService.getFullInfoBoardById(id)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Get('all-boards/:user_id')
    async getAllBoard(@Param('user_id') user_id: number) {
        try {
            return await this.boardsService.getAllBoards(user_id)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Put('add-user')
    async addUserAtBoard(@Body() data: BoardAddUserDto) {
        try {
            return this.boardsService.addUserAtBoard(data.user_id, data.board_id)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Post('add-column')
    async addColumnAtBoard(@Body() data: BoardAddColumnDto) {
        try {
            const newColumn = this.boardsService.createNewColumn(data.columnTitle)
            return await this.boardsService.addColumnAtBoard(newColumn, data.board_id)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Post('add-card')
    async addCardAtBoard(@Body() data: BoardAddCardDto) {
        try {
            const newCard = await this.boardsService.createNewCard(data.cardTitle)
            return this.boardsService.addCardAtColumn(data.column_id, newCard)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Put('move-card')
    async moveCardAtColumn(@Body() data: MoveCardAtColumnDto) {
        try {
            return await this.boardsService.moveCardAtColumn(data.column_id, data.card_id)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Put('change-board-title')
    async changeBoardTitle(@Body() data: ChangeBoardTitleDto) {
        try {
            return await this.boardsService.changeBoardTitle(data.board_id, data.board_title)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Put('change-card-title')
    async changeCardTitle(@Body() data: ChangeCardTitleDto) {
        try {
            return await this.boardsService.changeCardTitle(data.card_id, data.card_title)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Put('change-column-title')
    async changeColumnTitle(@Body() data: ChangeColumnTitleDto) {
        try {
            return await this.boardsService.changeColumnTitle(data.column_id, data.column_title)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Delete('delete-card')
    async deleteCardAtColumn(@Body() data: DeleteCardDto) {
        try {
            return await this.boardsService.deleteCard(data.card_id)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Delete('delete-column')
    async deleteColumnAtBoard(@Body() data: DeleteColumnDto, @Res() res: Response) {
        try {
            await this.boardsService.deleteColumn(data.column_id)
            return res.status(200).json('success')
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Delete('delete-board')
    async deleteBoard(@Res() res: Response, @Body() data: DeleteBoardDto) {
        try {
            await this.boardsService.deleteBoard(data.board_id)
            return res.status(200).json('success')
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Delete('delete-user')
    async deleteUsers(@Body() data: DeleteUserDto) {
        try {
            return this.boardsService.deleteUser(data.board_id, data.user_id)
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }
}