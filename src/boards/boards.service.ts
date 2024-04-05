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

}
