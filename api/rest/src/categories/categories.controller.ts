import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

import { GetCategoriesDto } from './dto/get-categories.dto';
import { Category } from './entities/category.entity';
import { ZodValidationPipe } from '../zod-validation.pipe';
import {
  CreateCategoryDto,
  CreateCategorySchema,
  UpdateCategoryDto,
  UpdateCategorySchema,
} from 'shop-shared/dist/category';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateCategorySchema))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: GetCategoriesDto) {
    return this.categoriesService.getCategories(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Category> {
    return await this.categoriesService.getCategory(id);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateCategorySchema))
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriesService.remove(id);
  }
}
