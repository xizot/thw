import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeDto, createTypeDtoSchema } from './create-type.dto';
import { z } from 'zod';

// export class UpdateTypeDto extends PartialType(CreateTypeDto) {}

export const updateTypeDtoSchema = createTypeDtoSchema
  .pick({
    name: true,
    language: true,
    icon: true,
    translated_languages: true,
    settings: true,
    promotional_sliders: true,
    banners: true,
  })
  .extend({
    name: z.string().optional(),
    language: z.string().optional(),
    icon: z.string().optional(),
  });

export type UpdateTypeDto = z.infer<typeof updateTypeDtoSchema>;
