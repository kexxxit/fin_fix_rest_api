import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './categories.model';
import { User } from '../users/users.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Operation } from '../operations/operations.model';
import { OperationsModule } from '../operations/operations.module';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  imports: [
    SequelizeModule.forFeature([Category, User, Operation]),
    JwtModule,
    AuthModule,
    forwardRef(() => OperationsModule),
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
