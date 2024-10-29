import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import {
  ManufacturersController,
  TopManufacturersController,
} from './manufacturers.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Manufacturer } from "./entities/manufacturer.entity";
import { TypesModule } from "../types/types.module";

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer]), TypesModule],
  controllers: [ManufacturersController, TopManufacturersController],
  providers: [ManufacturersService]
})
export class ManufacturersModule {}
