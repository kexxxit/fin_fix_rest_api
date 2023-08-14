import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './categories.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { OperationsService } from '../operations/operations.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
    private jwtService: JwtService,
    private authService: AuthService,
    @Inject(forwardRef(() => OperationsService))
    private operationsService: OperationsService,
  ) {}

  async createCategory(dto: CreateCategoryDto, req: Request) {
    const user = await this.authService.findUserByToken(req);
    return await this.categoryRepository.create({ ...dto, userId: user.id });
  }

  async getAllUserCategories(req: Request) {
    const user = await this.authService.findUserByToken(req);
    return await this.categoryRepository.findAll({
      where: { userId: user.id },
    });
  }

  async getUserCategoriesIdsArray(request: Request): Promise<number[]> {
    const userCategories = await this.getAllUserCategories(request);

    const categoriesIds = [];
    userCategories.forEach((elem) => {
      categoriesIds.push(elem.id);
    });
    return categoriesIds;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return await this.categoryRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id: id },
    });
  }

  async deleteCategory(request: Request, id: number): Promise<void> {
    const userCategories = await this.getUserCategoriesIdsArray(request);

    if (!userCategories.includes(id)) {
      throw new HttpException(
        'Данная категория не принадлежит этому пользователю',
        HttpStatus.BAD_REQUEST,
      );
    }

    const category = await this.getCategoryById(id);

    if (!category) {
      throw new HttpException(
        'Данной категории не существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.operationsService.deleteAllOperationsByCategoryId(id);

    await category.destroy();
  }
}
