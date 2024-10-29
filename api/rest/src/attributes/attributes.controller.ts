import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete, UsePipes, Req
} from "@nestjs/common";
import { AttributesService } from "./attributes.service";
import { ZodValidationPipe } from "../zod-validation.pipe";
import { Attribute } from "./entities/attribute.entity";
import { AttributeSchema, AttributeDto, AttributeUpdateSchema ,AttributeUpdateDto } from "shop-shared/dist/attribute";
import { RolesGuard } from "../auth/decorator/roles.decorator";
import { AuthGuard } from "../auth/decorator/auth.decorator";
import { Permission } from 'shop-shared/dist/auth';
import { Request } from "express";

@Controller("attributes")
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {
  }

  @Post()
  @UsePipes(new ZodValidationPipe(AttributeSchema))
  @RolesGuard(Permission.STORE_OWNER)
  @AuthGuard()
  async create(@Body() createAttributeDto: AttributeDto, @Req() request: Request): Promise<Attribute> {
    return await this.attributesService.create(createAttributeDto, request.user.id);
  }

  @Get()
  async findAll(): Promise<Attribute[]> {
    return await this.attributesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.attributesService.findOne(id);
  }

  @Put(":id")
  @UsePipes(new ZodValidationPipe(AttributeUpdateSchema))
  @RolesGuard(Permission.STORE_OWNER)
  @AuthGuard()
  async update(
    @Param("id") id: number,
    @Body() updateAttributeDto: AttributeUpdateDto,
    @Req() request: Request
  ): Promise<Attribute> {
    return await this.attributesService.update(id, updateAttributeDto, request.user.id);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<void> {
    return await this.attributesService.remove(id);
  }
}
