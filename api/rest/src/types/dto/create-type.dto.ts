import { z } from 'zod';
import { TypeSettings } from '../entities/typeSettings.entity';

// export class CreateTypeDto {}

export const bannerDtoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});
export const typeSettingsDtoSchema = z.object({
  isHome: z.boolean().optional(),
  layoutType: z.string().nonempty(),
  productCard: z.string().nonempty(),
});

export const attachmentSchema = z.object({
  thumbnail: z.string().optional(),
  original: z.string().optional(),
});

export const createTypeDtoSchema = z.object({
  name: z.string().nonempty(),
  icon: z.string().nonempty(),
  language: z.string().nonempty(),
  translated_languages: z.array(z.string()).optional(),
  settings: typeSettingsDtoSchema.optional(),
  promotional_sliders: z.array(attachmentSchema).optional(),
  banners: z.array(bannerDtoSchema).optional(),
});

export type CreateTypeDto = z.infer<typeof createTypeDtoSchema>;
