import { Module } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { TagsController } from "./tags.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypesModule } from "../types/types.module";
import { Tag } from "./entities/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), TypesModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService]
})
export class TagsModule {
}
