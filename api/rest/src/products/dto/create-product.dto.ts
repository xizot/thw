import { OmitType } from "@nestjs/swagger";
import { Product, ProductStatus, ProductType } from "../entities/product.entity";
import { z } from "zod";
// export class CreateProductDto extends OmitType(Product, [
//   'id',
//   'slug',
//   'created_at',
//   'updated_at',
//   // 'orders',
//   // 'pivot',
//   'shop',
//   'categories',
//   'tags',
//   'type',
//   // 'related_products',
//   // 'variation_options',
//   'translated_languages',
// ]) {
//   categories: number[];
//   tags: number[];
// }

export const createVariationOptionsSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  value: z.string().optional()
});

export const createVariationsSchema = z.object({
  id: z.number().optional(),
  title: z.string().optional(),
  price: z.number().optional(),
  sku: z.string().optional(),
  is_disable: z.boolean().optional(),
  is_digital: z.boolean().optional(),
  sale_price: z.number().optional(),
  quantity: z.number().optional(),
  options: z.array(createVariationOptionsSchema).optional()
});

export const createProductSchema = z.object({
  name: z.string().nonempty(),
  type_id: z.number().refine(value => value !== undefined, {
    message: "type_id is required",
    path: ["type_id"]
  }),
  manufacturer_id: z.number().optional(),
  categories: z.array(z.number()).optional(),
  tags: z.array(z.number()).optional(),
  product_type: z.nativeEnum(ProductType),
  variations: z.array(z.number()).optional(),
  variation_options: z.array(createVariationsSchema).optional(),
  shop_id: z.number().refine(value => value !== undefined, {
    message: "shop_id is required",
    path: ["shop_id"]
  }),
  description: z.string().optional(),
  max_price: z.number().optional(),
  min_price: z.number().optional(),
  sale_price: z.number().optional(),
  sku: z.string().optional(),
  status:  z.nativeEnum(ProductStatus),
  height: z.string().optional(),
  length: z.string().optional(),
  width: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  language: z.string().optional()
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

