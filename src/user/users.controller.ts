import {Body, Controller, Get, Param, Post, UseGuards} from "@nestjs/common";
import {Users} from "../entities/users.entity";
import {CreateUserDto} from "./dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UsersService} from "./users.service";
import {AuthGuard} from "../guard/auth.guard";
import {ApiBearerAuth, ApiHeader, ApiOkResponse} from "@nestjs/swagger";

@Controller('users')

export class UsersController {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private readonly usersService: UsersService,
    ) {}

    @Post('sign-up')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<Users | undefined> {
        try {
            return await this.usersService.createUser(createUserDto)
        } catch (e) {
            return e.message
        }
    }


    @Get(':email')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async getUserByEmail(@Param('email') email: string): Promise<Users | Object> {
        try {
            const user = await this.usersRepository.findOneBy({ email });
            if (!user) {
                return new Error("Пользователь не найден")
            }
            return {
                id: user.id,
                name: user.name,
                email: user.email
            }
        } catch (e) {
            return e.message
        }
    }
}