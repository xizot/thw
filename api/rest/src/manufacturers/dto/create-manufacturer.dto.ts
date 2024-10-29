import { OmitType } from "@nestjs/swagger";
import { Manufacturer } from "../entities/manufacturer.entity";
import { z } from "zod";
import { ShopSocials } from "../../settings/entities/shop-social.entity";

// export class CreateManufacturerDto extends OmitType(Manufacturer, [
//   'id',
//   // 'cover_image',
//   'description',
//   // 'image',
//   'name',
//   'products_count',
//   'slug',
//   'socials',
//   // 'type',
//   // 'type_id',
//   'website',
//   'translated_languages',
// ]) {
//   shop_id?: string;
// }

export const createShopSocialsDtoSchema = z.object({
  id: z.number().optional(),
  icon: z.string().optional(),
  url: z.string().optional()
});

export const createManufacturerDtoSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  language: z.string().nonempty(),
  website: z.string().optional(),
  type_id: z.number().refine(value => value !== undefined, {
    message: 'type_id is required',
    path: ['type_id'],
  }),
  socials: z.array(createShopSocialsDtoSchema).optional()
});

export type CreateManufacturerDto = z.infer<typeof createManufacturerDtoSchema>;
