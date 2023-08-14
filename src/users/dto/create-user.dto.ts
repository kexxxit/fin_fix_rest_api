import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {

    @ApiProperty({example: "email@email.com", description: "Адрес эл. почты"})
    @IsString({message: "Должно быть строкой"})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string

    @IsString({message: "Должно быть строкой"})
    @Length(8, 24, {message: "Пароль должен быть от 8 до 24 символов"})
    @ApiProperty({example: "qwerty123", description: "Пароль "})
    readonly password: string
}