import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

import typesJson from '@db/types.json';
import Fuse from 'fuse.js';
import { GetTypesDto } from './dto/get-types.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttachmentService } from '../attachment/attachment.service';
import slugify from 'slugify';
import { TypeSettings } from './entities/typeSettings.entity';
import { Banner } from './entities/banner.entity';

const types = plainToClass(Type, typesJson);
const options = {
  keys: ['name'],
  threshold: 0.3,
};
const fuse = new Fuse(types, options);

@Injectable()
export class TypesService {
  private types: Type[] = types;

  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,

    @InjectRepository(TypeSettings)
    private readonly typeSettingsRepository: Repository<TypeSettings>,

    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,

    private readonly attachmentService: AttachmentService,
  ) {}

  async getTypes({ text, search }: GetTypesDto) {
    let data: Type[] = await this.typeRepository.find();
    if (text?.replace(/%/g, '')) {
      data = fuse.search(text)?.map(({ item }) => item);
    }

    if (search) {
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
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

    return data;
  }

  async getTypeBySlug(slug: string): Promise<Type> {
    return await this.typeRepository.findOne({
      where: { slug },
      relations: {
        settings: true,
        promotional_sliders: true,
        banners: true,
        categories: true,
      },
    });
  }

  async create(createTypeDto: CreateTypeDto): Promise<Type> {
    const {  promotional_sliders, settings, banners, ...TypeData } =
      createTypeDto;


    const newType = await this.typeRepository.save(
      this.typeRepository.create(TypeData)
    );

    const [promotionalSlidersAttachments, savedSettings, savedBanners] =
      await Promise.all([
          promotional_sliders &&
          this.attachmentService.createMultipleAttachments(promotional_sliders),
        settings && this.typeSettingsRepository.save(settings),
        banners && this.bannerRepository.save(banners),
      ]);

    newType.promotional_sliders = promotionalSlidersAttachments;
    newType.settings = savedSettings;
    newType.banners = savedBanners;

    return this.typeRepository.save(newType);
  }

  findAll() {
    return `This action returns all types`;
  }

  async findOne(id: number): Promise<Type> {
    return this.typeRepository.findOne({
      where: { id }
    });
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    const { promotional_sliders, settings, banners, ...typeData } =
      updateTypeDto;

    const existingType: Type = await this.typeRepository.findOne({
      where: { id },
      relations: {
        settings: true,
        banners: true,
        promotional_sliders: true,
      },
    });

    if (!existingType) {
      throw new NotFoundException('Type not found');
    }
    if(settings) Object.assign(existingType.settings, settings);
    if(banners) Object.assign(existingType.banners, banners);

    Object.assign(existingType, typeData);

    return this.typeRepository.save(existingType);
  }

  async remove(id: number) {
    const existingType: Type = await this.typeRepository.findOne({
      where: { id },
    });

    if (!existingType) {
      throw new NotFoundException('Type not found');
    }

    await this.typeRepository.remove(existingType);
  }

}
