import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from './categories.model';

@ApiBearerAuth()
@ApiTags('Категории пользователя')
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @ApiOperation({ summary: 'Создание категории пользователя' })
  @ApiResponse({ status: 201, type: Category })
  @UseGuards(AuthGuard)
  @Post()
  async createCategory(
    @Body() dto: CreateCategoryDto,
    @Req() request: Request,
  ): Promise<Category> {
    return await this.categoryService.createCategory(dto, request);
  }

  @ApiOperation({ summary: 'Получения категорий пользователя' })
  @ApiResponse({ status: 200, type: [Category] })
  @UseGuards(AuthGuard)
  @Get()
  async getAllUserCategories(@Req() request: Request) {
    return await this.categoryService.getAllUserCategories(request);
  }

  @ApiOperation({ summary: 'Удаление категории' })
  @ApiResponse({ status: 204, type: [Category] })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUserCategoryById(
    @Req() request: Request,
    @Param('id') id: string,
  ) {
    return await this.categoryService.deleteCategory(request, Number(id));
  }
}
