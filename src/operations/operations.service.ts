import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Operation } from './operations.model';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { Op } from 'sequelize';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class OperationsService {
  constructor(
    @InjectModel(Operation) private operationRepository: typeof Operation,
    private authService: AuthService,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
  ) {}
  async createOperation(
    operationDto: CreateOperationDto,
    request: Request,
  ): Promise<Operation> {
    const user = await this.authService.findUserByToken(request);
    return await this.operationRepository.create({
      ...operationDto,
      userId: user.id,
    });
  }

  async getAllUserOperations(
    request: Request,
    startDate: Date,
    endDate: Date,
  ): Promise<Operation[]> {
    const user = await this.authService.findUserByToken(request);

    return await this.operationRepository.findAll({
      where: {
        userId: user.id,
        operationDate: { [Op.lte]: endDate, [Op.gte]: startDate },
      },
    });
  }

  async getOperationsByCategory(
    request: Request,
    startDate: Date,
    endDate: Date,
    categoryId: number,
  ): Promise<Operation[]> {
    const categoriesIds =
      await this.categoriesService.getUserCategoriesIdsArray(request);

    if (!categoriesIds.includes(categoryId)) {
      throw new HttpException(
        'Эта категория не принадлежит пользователю',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.operationRepository.findAll({
      where: {
        categoryId: categoryId,
        operationDate: { [Op.lte]: endDate, [Op.gte]: startDate },
      },
    });
  }

  async getOperationById(id: number): Promise<Operation | undefined> {
    return await this.operationRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id: id },
    });
  }

  async updateOperation(
    request: Request,
    operationId: number,
    body: UpdateOperationDto,
  ): Promise<void> {
    const categoriesIds =
      await this.categoriesService.getUserCategoriesIdsArray(request);

    const user = await this.authService.findUserByToken(request);

    if (body.categoryId && !categoriesIds.includes(body.categoryId)) {
      throw new HttpException(
        'Эта категория не принадлежит пользователю',
        HttpStatus.BAD_REQUEST,
      );
    }

    const operation = await this.getOperationById(operationId);

    if (!operation) {
      throw new HttpException(
        'Данная операция не найдена',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (operation.userId === user.id) {
      throw new HttpException(
        'Данная операция не принадлежит данному пользователю',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.categoryId) {
      operation.categoryId = body.categoryId;
    }

    if (body.operationDate) {
      operation.operationDate = body.operationDate;
    }

    if (body.amount) {
      operation.amount = body.amount;
    }

    if (body.description) {
      operation.description = body.description;
    }

    await operation.save();
  }

  async deleteOperation(request: Request, id: number): Promise<void> {
    const user = await this.authService.findUserByToken(request);

    const operation = await this.getOperationById(id);

    if (!operation) {
      throw new HttpException(
        'Данная операция не найдена',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (operation.userId === user.id) {
      throw new HttpException(
        'Данная операция не принадлежит данному пользователю',
        HttpStatus.BAD_REQUEST,
      );
    }

    await operation.destroy();
  }

  async deleteAllOperationsByCategoryId(categoryId: number): Promise<void> {
    const operations = await this.operationRepository.findAll({
      where: {
        categoryId: categoryId,
      },
    });

    operations.forEach((elem) => elem.destroy());
  }
}
