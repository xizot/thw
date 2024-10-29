import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Category } from './entities/category.entity';
import Fuse from 'fuse.js';
import categoriesJson from '@db/categories.json';
import { paginate } from 'src/common/pagination/paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from "typeorm";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'shop-shared/dist/category';
import { GetCategoriesDto } from './dto/get-categories.dto';

const categories = plainToClass(Category, categoriesJson);
const options = {
  keys: ['name', 'type.slug'],
  threshold: 0.3,
};
const fuse = new Fuse(categories, options);

@Injectable()
export class CategoriesService {
  private categories: Category[] = categories;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const {  parentId, image, ...categoryData } = createCategoryDto;


    const newCategory = this.categoryRepository.create({
      image,
      ...categoryData,
    });

    if (parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: parentId },
      });
      if (parentCategory) {
        newCategory.parent = parentCategory;
      }
    }

    return this.categoryRepository.save(newCategory);
  }

  getCategories({ limit, page, search, parent }: GetCategoriesDto) {
    if (!page) page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Category[] = this.categories;
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // data = data.filter((item) => item[key] === value);
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }
    if (parent === 'null') {
      data = data.filter((item) => item.parent === null);
    }
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }
    // if (hasType) {
    //   data = fuse.search(hasType)?.map(({ item }) => item);
    // }

    const results = data.slice(startIndex, endIndex);
    const url = `/categories?search=${search}&limit=${limit}&parent=${parent}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getCategory(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: { parent: true, children: true },
    });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const { parentId, image, ...categoryData } = updateCategoryDto;

    const existingCategory: Category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }


    Object.assign(existingCategory, categoryData);

    if (parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: parentId },
      });
      if (parentCategory) {
        existingCategory.parent = parentCategory;
      }
    } else {
      existingCategory.parent = null;
    }

    return this.categoryRepository.save(existingCategory);
  }

  async remove(id: number) {
    const existingCategory: Category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.remove(existingCategory);
  }

  async findCateByArrayId(ids: number[]): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
