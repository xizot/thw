import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentModule } from '../attachment/attachment.module';
import { Type } from './entities/type.entity';
import { TypeSettings } from './entities/typeSettings.entity';
import { Banner } from './entities/banner.entity';
import { AttachmentService } from "../attachment/attachment.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Type, TypeSettings, Banner]),
    AttachmentModule,
  ],
  controllers: [TypesController],
  providers: [TypesService],
  exports: [TypesService],
})
export class TypesModule {}
