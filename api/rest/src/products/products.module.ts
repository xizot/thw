import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import {
  ProductsController,
  PopularProductsController
} from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { TypesModule } from "../types/types.module";
import { ShopsModule } from "../shops/shops.module";
import { CategoriesModule } from "../categories/categories.module";
import { TagsModule } from "../tags/tags.module";
import { AttributesModule } from "../attributes/attributes.module";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), TypesModule, ShopsModule, CategoriesModule, TagsModule, AttributesModule],
  controllers: [ProductsController, PopularProductsController],
  providers: [ProductsService],
  exports:[ProductsService]
})
export class ProductsModule {
}
