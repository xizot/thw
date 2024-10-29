import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { AttachmentService } from '../attachment/attachment.service';
import { AttachmentModule } from '../attachment/attachment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AttachmentModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {
}
