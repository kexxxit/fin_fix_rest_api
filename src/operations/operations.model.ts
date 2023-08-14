import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../categories/categories.model';
import { User } from '../users/users.model';

interface OperationCreationAttr {
  amount: number;
  description: string;
  categoryId: number;
  operationDate: Date;
  userId: number;
}

@Table({ tableName: 'operations' })
export class Operation extends Model<Operation, OperationCreationAttr> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '20000', description: 'Сумма операции' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  amount: number;

  @ApiProperty({ example: 'Перевод другу', description: 'Описание операции' })
  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @ApiProperty({
    example: '2023-08-05T14:30:00Z',
    description: 'Дата операции в формате ISO 8601',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  operationDate: Date;

  @ApiProperty({
    example: '1',
    description:
      'Уникальный идентификатор категории к которой относится операция',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Category)
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
