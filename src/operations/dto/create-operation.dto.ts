import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, Length } from 'class-validator';

export class CreateOperationDto {
  @ApiProperty({ example: '20000', description: 'Сумма операции' })
  @IsNumber({}, { message: 'Сумма должна быть числом' })
  readonly amount: number;

  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор категории операции',
  })
  @IsString({ message: 'Идентификатор категории должен быть числом' })
  readonly categoryId: number;

  @ApiProperty({ example: 'Перевод другу', description: 'Описание операции' })
  @IsString({ message: 'Описание категории должно быть строкой' })
  @Length(0, 200, {
    message: 'Название категории должно быть не более 200 символов',
  })
  readonly description: string;

  @ApiProperty({
    example: '2023-08-05T14:30:00Z',
    description: 'Название категории',
  })
  @IsDate({ message: 'Неверный формат даты' })
  readonly operationDate: Date;
}
