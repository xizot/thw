import { Module } from "@nestjs/common";
import { AttributesService } from "./attributes.service";
import { AttributesController } from "./attributes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attribute } from "./entities/attribute.entity";
import { ShopsModule } from "../shops/shops.module";
import { AttributeValue } from "./entities/attribute-value.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Attribute,AttributeValue]), ShopsModule],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [AttributesService]
})
export class AttributesModule {
}
