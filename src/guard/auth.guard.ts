import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import {AuthService} from "../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {
    }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const header = request.headers.authorization;
        try {
            if (!header) {
                throw new UnauthorizedException('Не предоставлены учетные данные');
            }
            const token = header.split(' ')[1];
            if (!token) {
                throw new UnauthorizedException('Недействительные учетные данные');
            }
            const verifyToken = this.authService.verifyToken(token)
            if (!verifyToken) {
                throw new UnauthorizedException()
            }
        } catch (e) {
            throw new UnauthorizedException(e.message)
        }
        return true
    }
}
