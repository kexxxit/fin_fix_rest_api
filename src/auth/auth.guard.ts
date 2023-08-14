import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = AuthGuard.extractTokenFromHeader(request);
    if (!token) {
      AuthGuard.throwUnauthorizedError();
    }
    try {
      request['user'] = await this.jwtService.verify(token, {
        secret: process.env.PRIVATE_KEY,
      });
      console.log(request['user']);
    } catch (e) {
      console.log(e);
      AuthGuard.throwUnauthorizedError();
    }
    return true;
  }

  private static throwUnauthorizedError(): void {
    throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
  }

  private static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
