import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../categories/categories.model';
import { Operation } from '../operations/operations.model';

interface UserCreationAttr {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttr> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'email@email.com', description: 'Адрес эл. почты' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: 'qwerty123', description: 'Пароль' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasMany(() => Category)
  categories: Category[];

  @HasMany(() => Operation)
  operations: Operation[];
}
