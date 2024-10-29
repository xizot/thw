import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query, UsePipes
} from "@nestjs/common";
import { TagsService } from './tags.service';
import { CreateTagDto, createTagDtoSchema } from "./dto/create-tag.dto";
import { UpdateTagDto, updateTagDtoSchema } from "./dto/update-tag.dto";
import { GetTagsDto, TagPaginator } from './dto/get-tags.dto';
import { ZodValidationPipe } from "../zod-validation.pipe";
import { Tag } from "./entities/tag.entity";

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createTagDtoSchema))
  async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return await this.tagsService.create(createTagDto);
  }

  @Get()
  async findAll(@Query() query: GetTagsDto): Promise<TagPaginator> {
    return this.tagsService.findAll(query);
  }

  @Get(":slug")
  async findOne(@Param("slug") slug: string, @Query("language") language: string) {
    return await this.tagsService.findOne(slug, language);
  }

  @Put(":id")
  @UsePipes(new ZodValidationPipe(updateTagDtoSchema))
  async update(@Param("id") id: number, @Body() updateTagDto: UpdateTagDto): Promise<Tag> {
    return await this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.tagsService.remove(id);
  }
}
