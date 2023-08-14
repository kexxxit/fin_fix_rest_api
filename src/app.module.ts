import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/categories.model';
import { OperationsModule } from './operations/operations.module';
import { Operation } from './operations/operations.model';

@Module({
  controllers: [CategoriesController],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      models: [User, Category, Operation],
      autoLoadModels: true,
      sync: {
        alter: true,
      },
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    OperationsModule,
  ],
})
export class AppModule {}
