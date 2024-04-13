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
        try {
            const currentUser = await this.usersService.getUserByEmail(userData.email)
            if (!currentUser) {
                return new BadRequestException('Пользователь не найден')
            }
            const passwordCheck = await this.passwordService.verifyPassword(userData.email, userData.password)
            if (!passwordCheck) {
                return new BadRequestException()
            }
            const tokens = this.authService.generateTokens(currentUser)
            await this.authService.saveToken(currentUser.email, tokens.refreshToken)
            response.cookie('refreshToken', tokens.refreshToken)
            return response.status(HttpStatus.OK).json({
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name,
                accessToken: tokens.accessToken
            });
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Put('refresh')
    async refreshAccessToken(@Req() request: Request, @Res() response: Response) {
        try {
            const refreshToken = request.cookies['refreshToken']

            if (!refreshToken) {
                return new UnauthorizedException()
            }
            const verifyToken = this.authService.verifyToken(refreshToken)
            if (!verifyToken) {
                response.clearCookie('refreshToken')
                return new UnauthorizedException()
            }
            const newTokens = this.authService.generateTokens(verifyToken)
            response.cookie('refreshToken', newTokens.refreshToken)
            response.cookie('accessToken', newTokens.accessToken)
            return response.status(HttpStatus.OK).json({accessToken: newTokens.accessToken})
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }

    @Put('sign-out')
    async signOutUser(@Res() response: Response, @Body() signOutDto: SignOutDto) {
        try {
            await this.usersService.signOut(signOutDto.email)
            response.clearCookie('refreshToken')
            response.status(HttpStatus.OK).json('Успешный выход')
        } catch (e) {
            return new BadRequestException(e.message)
        }
    }
}