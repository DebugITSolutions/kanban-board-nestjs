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
        if (!header) {
            throw new UnauthorizedException('Не предоставлены учетные данные');
        }
        const token = header.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Недействительные учетные данные');
        }
        return this.isAuthenticated(request);
    }

    private isAuthenticated(request: any): boolean {
        const header = request.headers.authorization
        const token = header.split(' ')[1]
        const verifyToken = this.authService.verifyToken(token)
        return !!verifyToken
    }
}
