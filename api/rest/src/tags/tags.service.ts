import { Injectable, NotFoundException } from "@nestjs/common";
import { paginate } from "src/common/pagination/paginate";
import { CreateTagDto } from "./dto/create-tag.dto";
import { GetTagsDto } from "./dto/get-tags.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { Tag } from "./entities/tag.entity";
import tagsJson from "@db/tags.json";
import { plainToClass } from "class-transformer";
import Fuse from "fuse.js";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { TypesService } from "../types/types.service";

const tags = plainToClass(Tag, tagsJson);

const options = {
  keys: ['name'],
  threshold: 0.3,
};
const fuse = new Fuse(tags, options);

@Injectable()
export class TagsService {
  private tags: Tag[] = tags;

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly typeService: TypesService
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const { type_id, ...tagData } = createTagDto;
    const tag = this.tagRepository.create(tagData);

    if (type_id) {
      const type = await this.typeService.findOne(type_id);
      if (type) {
        tag.type = type;
      }
    }

    return this.tagRepository.save(tag);
  }

  findAll({ page, limit, search }: GetTagsDto) {
    if (!page) page = 1;
    let data: Tag[] = this.tags;
    if (search) {
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        console.log(value, 'value');
        // TODO: Temp Solution
        if (key !== 'slug') {
          searchText.push({
            [key]: value,
          });
        }
      }

      data = fuse
        .search({
          $and: searchText,
        })
        ?.map(({ item }) => item);
    }

    const url = `/tags?limit=${limit}`;
    return {
      data,
      ...paginate(this.tags.length, page, limit, this.tags.length, url),
    };
  }

  async findOne(slug: string, language: string): Promise<Tag> {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.id = :slug OR tag.slug = :slug', { slug })
      .getOne();
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const { type_id, ...tagData } = updateTagDto;

    const existingTag: Tag = await this.tagRepository.findOne({
      where: { id },
      relations: {
        type: true
      }
    });

    if (!existingTag) {
      throw new NotFoundException("Tag not found");
    }

    if (type_id && type_id !== existingTag.type?.id) {
      const type = await this.typeService.findOne(type_id);
      if (type) {
        existingTag.type = type;
      }
    }

    Object.assign(existingTag, tagData);

    return this.tagRepository.save(existingTag);
  }

  async remove(id: number) {
    const existingTag: Tag = await this.tagRepository.findOne({
      where: { id }
    });

    if (!existingTag) {
      throw new NotFoundException("Manufacturer not found");
    }

    await this.tagRepository.remove(existingTag);
  }

  async findTagByArrayId(ids: number[]): Promise<Tag[]> {
    return this.tagRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
