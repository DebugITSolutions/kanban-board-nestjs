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
        try {
            const currentUser = await this.userRepository.findOne({where: {id: boardInfo.user_id}})

            if (!currentUser) {
                return new BadRequestException()
            }

            const column1 = new Columns();
            column1.name = 'Колонка 1';
            await this.columnsRepository.save(column1);

            const column2 = new Columns();
            column2.name = 'Колонка 2';
            await this.columnsRepository.save(column2);

            const board = new Boards();
            board.title = boardInfo.title ? boardInfo.title : 'Новая доска'
            board.columns = [column1, column2]
            board.users = [{...currentUser, password: ''}]
            await this.boardsRepository.save(board);
        } catch (e) {
            return e.message
        }
    }

    async getFullInfoBoardById(id: number) {
        try {
            const board = await this.boardsRepository.findOne({
                where: {id: id},
                relations: ['users', 'columns', 'columns.cards']
            })

            if (!board) {
                return new BadRequestException()
            }

            return board

        } catch (e) {
            return e.message
        }
    }

    createNewColumn(title: string) {
        try {
            const column = new Columns()
            column.name = title
            return column
        } catch(e) {
            return e.message
        }
    }

    async createNewCard(title: string) {
        try {
            const card = new Cards()
            card.title = title
            return await this.cardsRepository.save(card)
        } catch(e) {
            return e.message
        }
    }

    async addCardAtColumn(column_id: number, card: Cards) {
        const currentColumn = await this.columnsRepository.findOne({where: {id: column_id}})
        if (!currentColumn) {
            return new BadRequestException()
        }

        if (!card) {
            return new BadRequestException()
        }

        card.columns = currentColumn
        await this.cardsRepository.save(card)
        await this.columnsRepository.save(currentColumn)
        return await this.columnsRepository.findOne({
            where: {id: column_id},
            relations: ['cards']
        })
    }

    async addColumnAtBoard(column: Columns, board_id: number) {
        try {
            const currentBoard = await this.boardsRepository.findOne({where: {id: board_id}})
            if (!currentBoard) {
                return new BadRequestException()
            }

            if (!column) {
                return new BadRequestException()
            }

            column.boards = currentBoard
            await this.columnsRepository.save(column)
            await this.boardsRepository.save(currentBoard)
            return await this.boardsRepository.findOne({
                where: {id: board_id},
                relations: ['users', 'columns', 'columns.cards']
            })
        } catch (e) {
            return e.message
        }
    }
}
