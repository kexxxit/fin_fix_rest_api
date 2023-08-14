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
import { User } from '../users/users.model';
import { Operation } from '../operations/operations.model';

interface CategoryCreationAttr {
  categoryName: string;
  userId: number;
}

@Table({ tableName: 'categories' })
export class Category extends Model<Category, CategoryCreationAttr> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: Number;

  @ApiProperty({ example: 'Продукты', description: 'Название категории' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  categoryName: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => Operation)
  operations: Operation[];
}
