import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { TokenResponse } from './auth.controller';
import e, { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto): Promise<TokenResponse> {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto): Promise<TokenResponse> {
    const foundUser = await this.usersService.getUserByEmail(userDto.email);
    if (foundUser) {
      throw new HttpException(
        'Пользователь с таким email найден',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  private generateToken(user: User): TokenResponse {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload, { secret: process.env.PRIVATE_KEY }),
    };
  }

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    const foundUser = await this.usersService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      foundUser.password,
    );
    if (foundUser && passwordEquals) {
      return foundUser;
    }
    throw new UnauthorizedException({
      message: 'Некорректный email или пароль',
    });
  }

  async findUserByToken(req: Request) {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      throw new Error('Authorization header is missing');
    }

    const token = authorizationHeader.split(' ')[1].trim();

    if (!token) {
      throw new UnauthorizedException({ message: 'Token is missing' });
    }

    try {
      return await this.jwtService.verify(token, {
        secret: String(process.env.PRIVATE_KEY),
      });
    } catch (error) {
      throw new UnauthorizedException({ message: 'Invalid token' });
    }
  }
}
