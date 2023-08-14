import { forwardRef, Inject, Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Operation } from './operations.model';
import { Category } from '../categories/categories.model';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  providers: [OperationsService],
  controllers: [OperationsController],
  imports: [
    SequelizeModule.forFeature([Operation, Category]),
    AuthModule,
    forwardRef(() => CategoriesModule),
  ],
  exports: [OperationsService],
})
export class OperationsModule {}
