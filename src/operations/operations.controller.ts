import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { Operation } from './operations.model';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { GetOperationsDto } from './dto/get-operations.dto';

export interface OperationsBody {
  startDate: Date;
  endDate: Date;
}

@ApiTags('Операции')
@ApiBearerAuth()
@Controller('operations')
export class OperationsController {
  constructor(private operationService: OperationsService) {}

  @ApiOperation({ summary: 'Создание операции' })
  @ApiResponse({ status: 200, type: Operation })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() operationDto: CreateOperationDto, @Req() request: Request) {
    return this.operationService.createOperation(operationDto, request);
  }

  @ApiOperation({
    summary: 'Получение всех операций пользователя в интервале дат',
  })
  @ApiResponse({ status: 200, type: [Operation] })
  @UseGuards(AuthGuard)
  @Get()
  getAllUserOperations(
    @Req() request: Request,
    @Body() dates: GetOperationsDto,
  ) {
    return this.operationService.getAllUserOperations(
      request,
      dates.startDate,
      dates.endDate,
    );
  }

  @ApiOperation({
    summary:
      'Получение операций пользователя по выбранной категории в интервале дат',
  })
  @ApiResponse({ status: 200, type: [Operation] })
  @UseGuards(AuthGuard)
  @Get(':id')
  getOperationsByCategory(
    @Req() request: Request,
    @Body() body: OperationsBody,
    @Param('id') id: number,
  ) {
    return this.operationService.getOperationsByCategory(
      request,
      body.startDate,
      body.endDate,
      Number(id),
    );
  }

  @ApiOperation({
    summary: 'Изменение операции',
  })
  @ApiResponse({ status: 201, type: [Operation] })
  @UseGuards(AuthGuard)
  @Put(':id')
  updateOperation(
    @Req() request: Request,
    @Body() body: UpdateOperationDto,
    @Param('id') id: string,
  ) {
    return this.operationService.updateOperation(request, Number(id), body);
  }

  @ApiOperation({
    summary: 'Удаление операции',
  })
  @ApiResponse({ status: 204, type: [Operation] })
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteOperation(@Req() request: Request, @Param('id') id: string) {
    return this.operationService.deleteOperation(request, Number(id));
  }
}
