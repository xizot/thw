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
import { TypesService } from './types.service';
import { CreateTypeDto, createTypeDtoSchema } from './dto/create-type.dto';
import { UpdateTypeDto, updateTypeDtoSchema } from './dto/update-type.dto';
import { GetTypesDto } from './dto/get-types.dto';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { Type } from './entities/type.entity';
import { RolesGuard } from "../auth/decorator/roles.decorator";
import { AuthGuard } from "../auth/decorator/auth.decorator";
import { Permission } from 'shop-shared/dist/auth';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createTypeDtoSchema))
  @RolesGuard(Permission.SUPER_ADMIN)
  @AuthGuard()
  async create(@Body() createTypeDto: CreateTypeDto): Promise<Type> {
    return await this.typesService.create(createTypeDto);
  }

  @Get()
  @RolesGuard(Permission.SUPER_ADMIN, Permission.STORE_OWNER)
  @AuthGuard()
  async findAll(@Query() query: GetTypesDto) {
    return await this.typesService.getTypes(query);
  }

  @Get(":slug")
  @RolesGuard(Permission.SUPER_ADMIN, Permission.STORE_OWNER)
  @AuthGuard()
  async getTypeBySlug(@Param('slug') slug: string): Promise<Type> {
    return await this.typesService.getTypeBySlug(slug);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateTypeDtoSchema))
  @RolesGuard(Permission.SUPER_ADMIN)
  @AuthGuard()
  async update(@Param('id') id: number, @Body() updateTypeDto: UpdateTypeDto) {
    return await this.typesService.update(id, updateTypeDto);
  }

  @Delete(':id')
  @RolesGuard(Permission.SUPER_ADMIN)
  @AuthGuard()
  async remove(@Param('id') id: number) {
    return await this.typesService.remove(id);
  }
}
