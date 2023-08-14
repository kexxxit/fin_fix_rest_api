import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../pipes/validation.pipe';

export interface TokenResponse {
  token: string;
}

class TokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imt2YXNoZXZpY2g4ffsdpbC5jb20iLCJpZCI6MiwiaWF0IjoxNjkxMzAzMTU1LCJleHAiOjE2OTEzODk1NTV9.P5ROfab6qrpT04acmIfBfrjKMarXUqYAdWDX-mq2jqI',
    description: 'Токен',
  })
  readonly token: string;
}

@ApiTags('Авторизация')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация' })
  @ApiResponse({ status: 200, type: TokenDto })
  @Post('/login')
  login(@Body() userDto: CreateUserDto): Promise<TokenResponse> {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 201, type: TokenDto })
  @UsePipes(ValidationPipe)
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto): Promise<TokenResponse> {
    return this.authService.registration(userDto);
  }
}
