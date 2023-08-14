import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOperationDto } from './create-operation.dto';
import { IsDate, IsString, Length } from 'class-validator';

export class GetOperationsDto {
  @ApiProperty({
    example: '2023-08-05T14:30:00Z',
    description: 'Начало интервала дат',
  })
  @IsDate({ message: 'Поле должно быть датой' })
  readonly startDate: Date;

  @ApiProperty({
    example: '2023-08-13T14:30:00Z',
    description: 'Окончание интервала дат',
  })
  @IsDate({ message: 'Поле должно быть датой' })
  readonly endDate: Date;
}
