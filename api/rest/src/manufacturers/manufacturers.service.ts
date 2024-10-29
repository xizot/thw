import { Injectable, NotFoundException } from "@nestjs/common";
import { Manufacturer } from "./entities/manufacturer.entity";
import manufacturersJson from "@db/manufacturers.json";
import { plainToClass } from "class-transformer";
import Fuse from "fuse.js";
import { GetTopManufacturersDto } from "./dto/get-top-manufacturers.dto";
import { GetManufacturersDto, ManufacturerPaginator } from "./dto/get-manufactures.dto";
import { paginate } from "../common/pagination/paginate";
import { CreateManufacturerDto } from "./dto/create-manufacturer.dto";
import { UpdateManufacturerDto } from "./dto/update-manufacturer.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypesService } from "../types/types.service";
import { Type } from "../types/entities/type.entity";
import slugify from "slugify";

const manufacturers = plainToClass(Manufacturer, manufacturersJson);

const options = {
  keys: ['name'],
  threshold: 0.3,
};

const fuse = new Fuse(manufacturers, options);

@Injectable()
export class ManufacturersService {
  private manufacturers: Manufacturer[] = manufacturers;

  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly typeService: TypesService
  ) {}

  async create(createManufacturerDto: CreateManufacturerDto): Promise<Manufacturer> {
    const { type_id, ...manufacturerData } = createManufacturerDto;
    const manufacturer = this.manufacturerRepository.create(manufacturerData);

    if (type_id) {
      const type = await this.typeService.findOne(type_id);
      if (type) {
        manufacturer.type = type;
      }
    }

    return this.manufacturerRepository.save(manufacturer);
  }


  async getManufactures({
    limit,
    page,
    search,
  }: GetManufacturersDto): Promise<ManufacturerPaginator> {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Manufacturer[] = this.manufacturers;
    if (search) {
      console.log('search', search);
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/manufacturers?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getTopManufactures({
    limit = 10,
  }: GetTopManufacturersDto): Promise<Manufacturer[]> {
    return manufacturers.slice(0, limit);
  }

  async getManufacturesBySlug(slug: string): Promise<Manufacturer> {
    return this.manufacturerRepository.findOne({ where: { slug } });
  }

  async update(id: number, updateManufacturesDto: UpdateManufacturerDto) :Promise<Manufacturer> {
    const { type_id, ...manufacturerData } = updateManufacturesDto;

    const existingManuFacture: Manufacturer = await this.manufacturerRepository.findOne({
      where: { id },
      relations: {
        type:true,
        socials:true
      },
    });

    if (!existingManuFacture) {
      throw new NotFoundException('Manufacturer not found');
    }

    if (type_id && type_id !== existingManuFacture.type.id) {
      const type = await this.typeService.findOne(type_id);
      if (type) {
        existingManuFacture.type = type;
      }
    }

    Object.assign(existingManuFacture, manufacturerData);

    return this.manufacturerRepository.save(existingManuFacture);
  }

  async remove(id: number) {
    const existingManu: Manufacturer = await this.manufacturerRepository.findOne({
      where: { id },
    });

    if (!existingManu) {
      throw new NotFoundException('Manufacturer not found');
    }

    await this.manufacturerRepository.remove(existingManu);
  }
}
