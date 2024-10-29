import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto, ProductPaginator } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { paginate } from 'src/common/pagination/paginate';
import productsJson from '@db/products.json';
import Fuse from 'fuse.js';
import { GetPopularProductsDto } from './dto/get-popular-products.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypesService } from "../types/types.service";
import { ShopsService } from "../shops/shops.service";
import { CategoriesService } from "../categories/categories.service";
import { TagsService } from "../tags/tags.service";
import { AttributesService } from "../attributes/attributes.service";
import { Shop } from "../shops/entities/shop.entity";

const products = plainToClass(Product, productsJson);

const options = {
  keys: [
    'name',
    'type.slug',
    'categories.slug',
    'status',
    'shop_id',
    'author.slug',
    'tags',
    'manufacturer.slug',
  ],
  threshold: 0.3,
};
const fuse = new Fuse(products, options);

@Injectable()
export class ProductsService {
  private products: any = products;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly typeService: TypesService,
    private readonly shopsService: ShopsService,
    private readonly categoriesService: CategoriesService,
    private readonly tagsService: TagsService,
    private readonly attributesService: AttributesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const {
      type_id,
      shop_id,
      categories,
      tags,
      variations,
      ...productData
    } = createProductDto;
    const product = this.productRepository.create(productData);

    await Promise.all([
      this.assignShop(product, shop_id),
      this.assignType(product, type_id),
      this.assignCategories(product, categories),
      this.assignTags(product, tags),
      this.assignVariations(product, variations)
    ]);

    return this.productRepository.save(product);
  }

  private async assignShop(product: Product, shop_id: number): Promise<void> {
    if (shop_id) {
      const shop = await this.shopsService.findOne(shop_id);
      if (shop) {
        product.shop = shop;
      }
    }
  }

  private async assignType(product: Product, type_id: number): Promise<void> {
    if (type_id) {
      const type = await this.typeService.findOne(type_id);
      if (type) {
        product.type = type;
      }
    }
  }

  private async assignCategories(product: Product, categoryIds: number[]): Promise<void> {
    if (categoryIds) {
      const listCate = await this.categoriesService.findCateByArrayId(categoryIds);
      if (listCate) {
        product.categories = listCate;
      }
    }
  }

  private async assignTags(product: Product, tagIds: number[]): Promise<void> {
    if (tagIds) {
      const listTag = await this.tagsService.findTagByArrayId(tagIds);
      if (listTag) {
        product.tags = listTag;
      }
    }
  }

  private async assignVariations(product: Product, variationIds: number[]): Promise<void> {
    if (variationIds) {
      const listVariation = await this.attributesService.findAttributeValueByArrayId(variationIds);
      if (listVariation) {
        product.variations = listVariation;
      }
    }
  }

  getProducts({ limit, page, search }: GetProductsDto): ProductPaginator {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Product[] = this.products;
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

    const results = data.slice(startIndex, endIndex);
    const url = `/products?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getProductBySlug(slug: string): Product {
    const product = this.products.find((p) => p.slug === slug);
    const related_products = this.products
      .filter((p) => p.type.slug === product.type.slug)
      .slice(0, 20);
    return {
      ...product,
      related_products,
    };
  }

  getPopularProducts({ limit, type_slug }: GetPopularProductsDto): Product[] {
    let data: any = this.products;
    if (type_slug) {
      data = fuse.search(type_slug)?.map(({ item }) => item);
    }
    return data?.slice(0, limit);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.products[0];
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id }
    });
  }
}
