import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Продукты', description: 'Название категории' })
  @IsString({ message: 'Название категории должно быть строкой' })
  @Length(4, 20, {
    message: 'Название категории должно быть длинной от 4 до 20 символов ',
  })
  readonly categoryName: string;
}
