import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query, UsePipes
} from "@nestjs/common";
import { ManufacturersService } from './manufacturers.service';
import { GetTopManufacturersDto } from './dto/get-top-manufacturers.dto';
import { Manufacturer } from './entities/manufacturer.entity';
import {
  GetManufacturersDto,
  ManufacturerPaginator,
} from './dto/get-manufactures.dto';
import { CreateManufacturerDto, createManufacturerDtoSchema } from "./dto/create-manufacturer.dto";
import { UpdateManufacturerDto, updateManufacturerDtoSchema } from "./dto/update-manufacturer.dto";
import { ZodValidationPipe } from "../zod-validation.pipe";

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createManufacturerDtoSchema))
  async createProduct(@Body() createManufactureDto: CreateManufacturerDto):Promise<Manufacturer> {
    return await this.manufacturersService.create(createManufactureDto);
  }

  @Get()
  async getManufactures(
    @Query() query: GetManufacturersDto,
  ): Promise<ManufacturerPaginator> {
    return this.manufacturersService.getManufactures(query);
  }

  @Get(':slug')
  async getManufactureBySlug(
    @Param('slug') slug: string,
  ): Promise<Manufacturer> {
    return await this.manufacturersService.getManufacturesBySlug(slug);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateManufacturerDtoSchema))
  async update(
    @Param('id') id: number,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ):Promise<Manufacturer> {
    return await this.manufacturersService.update(id, updateManufacturerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.manufacturersService.remove(id);
  }
}

@Controller('top-manufacturers')
export class TopManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Get()
  async getTopManufactures(
    @Query() query: GetTopManufacturersDto,
  ): Promise<Manufacturer[]> {
    return this.manufacturersService.getTopManufactures(query);
  }
}
