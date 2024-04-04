import {
    BadRequestException,
    Body,
    Controller,
    HttpStatus,
    Post, Put,
    Req,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {UsersService} from "../user/users.service";
import {Request, Response} from "express";
import {PasswordService} from "./password.service";
import {SignInDto, SignOutDto} from "./dto";



@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly passwordService: PasswordService
    )
    {}

    @Post('sign-in')
    async loginUser(@Res() response: Response, @Body() userData: SignInDto) {
        const currentUser = await this.usersService.getUserByEmail(userData.email)
        if (!currentUser) {
            throw new BadRequestException('Пользователь не найден')
        }
        const passwordCheck = await this.passwordService.verifyPassword(userData.email, userData.password)
        if (!passwordCheck) {
            throw new BadRequestException()
        }
        const tokens = this.authService.generateTokens(currentUser)
        await this.authService.saveToken(currentUser.email, tokens.refreshToken)
        response.cookie('refreshToken', tokens.refreshToken)
        return response.status(HttpStatus.OK).json({
                email: currentUser.email,
                name: currentUser.name,
                accessToken: tokens.accessToken
        });
    }

    @Put('refresh')
    async refreshAccessToken(@Req() request: Request, @Res() response: Response) {
        const refreshToken = request.cookies['refreshToken']
        if (!refreshToken) {
            throw new UnauthorizedException()
        }
        const verifyToken = this.authService.verifyToken(refreshToken)
        if (!verifyToken) {
            throw new UnauthorizedException()
        }
        const newTokens = this.authService.generateTokens(verifyToken)
        response.cookie('refreshToken', newTokens.refreshToken)
        return response.status(HttpStatus.OK).json({accessToken: newTokens.accessToken})
    }

    @Put('sign-out')
    async signOutUser(@Res() response: Response, @Body() signOutDto: SignOutDto) {
        await this.usersService.signOut(signOutDto.email)
        response.clearCookie('refreshToken')
        response.status(HttpStatus.OK).json('Успешный выход')
    }
}