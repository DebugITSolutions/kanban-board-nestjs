import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Boards} from "../entities/boards.entity";
import {Repository} from "typeorm";
import {Cards} from "../entities/cards.entity";
import {Columns} from "../entities/columns.entity";
import {Users} from "../entities/users.entity";
import {BoardsCreateDto} from "./dto";

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Boards)
        private boardsRepository: Repository<Boards>,
        @InjectRepository(Cards)
        private cardsRepository: Repository<Cards>,
        @InjectRepository(Columns)
        private columnsRepository: Repository<Columns>,
        @InjectRepository(Users)
        private userRepository: Repository<Users>
    ) {
    }

    async createNewBoard(boardInfo: BoardsCreateDto) {
        const currentUser = await this.userRepository.findOne({where: {id: boardInfo.user_id}})

        if (!currentUser) {
            throw new BadRequestException()
        }

        const column1 = this.createNewColumn('Новая колонка 1')
        await this.columnsRepository.save(column1);

        const column2 = this.createNewColumn('Новая колонка 2')
        await this.columnsRepository.save(column2);

        const board = new Boards();
        board.title = boardInfo.title ? boardInfo.title : 'Новая доска'
        board.columns = [column1, column2]
        board.users = [{...currentUser, password: ''}]
        await this.boardsRepository.save(board);
        return board
    }

    async getAllBoards(user_id: number) {
        const allBoards = await this.userRepository
            .createQueryBuilder()
            .select('board')
            .from(Boards, 'board')
            .innerJoin('board.users', 'user')
            .where('user.id = :user_id', { user_id })
            .getMany()


        if (!allBoards) {
            throw new BadRequestException()
        }
        return allBoards
    }

    async getFullInfoBoardById(id: number) {
        const board = await this.boardsRepository.findOne({
            where: {id: id},
            relations: ['users', 'columns', 'columns.cards']
        })

        if (!board) {
            throw new BadRequestException()
        }

        return board
    }

    createNewColumn(title: string) {
        const column = new Columns()
        column.title = title
        return column
    }

    async createNewCard(title: string) {
        const card = new Cards()
        card.title = title
        return await this.cardsRepository.save(card)
    }

    async addCardAtColumn(column_id: number, card: Cards) {
        const currentColumn = await this.columnsRepository.findOne({
            where: {id: column_id},
            relations: ['boards']
        })
        if (!currentColumn) {
            throw new BadRequestException()
        }

        if (!card) {
            throw new BadRequestException()
        }

        card.columns = currentColumn
        await this.cardsRepository.save(card)
        await this.columnsRepository.save(currentColumn)
        return await this.getFullInfoBoardById(currentColumn?.boards.id)
    }

    async addColumnAtBoard(column: Columns, board_id: number) {
        const currentBoard = await this.boardsRepository.findOne({where: {id: board_id}})
        if (!currentBoard) {
            throw new BadRequestException()
        }

        if (!column) {
            throw new BadRequestException()
        }

        column.boards = currentBoard
        await this.columnsRepository.save(column)
        await this.boardsRepository.save(currentBoard)
        return await this.getFullInfoBoardById(board_id)
    }

    async addUserAtBoard(user_id:number, board_id:number) {
        const currentBoard = await this.boardsRepository.findOne({
            where: {id: board_id},
            relations: ['users']
        })
        if (!currentBoard) {
            throw new BadRequestException()
        }

        const currentUser = await this.userRepository.findOne({where: {id: user_id}})

        if (!currentUser) {
            throw new BadRequestException()
        }
        currentUser.password = ''
        currentBoard.users = [...currentBoard.users, currentUser]
        await this.boardsRepository.save(currentBoard)
        return await this.getFullInfoBoardById(board_id)
    }

    async moveCardAtColumn(column_id: number, card_id: number) {
        const currentColumn = await this.columnsRepository.findOne({
            where: {id: column_id},
            relations: ['boards']
        })

        if (!currentColumn) {
            throw new BadRequestException()
        }

        const currentCard = await this.cardsRepository.findOne({where: {id: card_id}})

        if (!currentCard) {
            throw new BadRequestException()
        }

        currentCard.columns = currentColumn
        await this.cardsRepository.save(currentCard)
        await this.columnsRepository.save(currentColumn)
        return await this.getFullInfoBoardById(currentColumn.boards.id)
    }

    async deleteCard(card_id:number) {
        const currentCard = await this.cardsRepository.findOne({
            where: {id: card_id},
            relations: ['columns', 'columns.boards']
        })
        if (!currentCard) {
            throw new BadRequestException()
        }
        await this.cardsRepository.delete({id: card_id})
        return this.getFullInfoBoardById(currentCard?.columns.boards.id)
    }

    async deleteBoard(board_id: number) {
        await this.boardsRepository.delete({id: board_id})
    }

    async deleteColumn(column_id: number) {
        await this.columnsRepository.delete({id: column_id})
    }

    async deleteUser(board_id: number, user_id: number) {
        const currentBoard = await this.boardsRepository.findOne({
            where: {id: board_id},
            relations: ['users']
        })

        if (!currentBoard) {
            throw new BadRequestException()
        }

        const currentUser = await this.userRepository.findOne({where: {id: user_id}})
        if (!currentUser) {
            throw new BadRequestException()
        }

        currentBoard.users = currentBoard.users.filter((item) => item.id !== user_id)
        await this.boardsRepository.save(currentBoard)
        return this.getFullInfoBoardById(board_id)
    }

    async changeColumnTitle(column_id: number, newTitle: string) {
        const currentColumn = await this.columnsRepository.findOne({
            where: {id: column_id},
            relations: ['boards']
        })
        if (!currentColumn) {
            throw new BadRequestException()
        }
        currentColumn.title = newTitle
        await this.columnsRepository.save(currentColumn)
        return this.getFullInfoBoardById(currentColumn.boards.id)
    }

    async changeBoardTitle(board_id:number, newTitle: string) {
        const currentBoard = await this.boardsRepository.findOne({where: {id: board_id}})
        if (!currentBoard) {
            throw new BadRequestException()
        }

        currentBoard.title = newTitle
        await this.boardsRepository.save(currentBoard)
        return this.getFullInfoBoardById(board_id)
    }

    async changeCardTitle(card_id: number, newTitle: string) {
        const currentCard = await this.cardsRepository.findOne({
            where: {id: card_id},
            relations: ['columns', 'columns.boards'],

        })
        if (!currentCard) {
            throw new BadRequestException()
        }

        currentCard.title = newTitle
        await this.cardsRepository.save(currentCard)
        return await this.getFullInfoBoardById(currentCard.columns.boards.id)
    }
}
