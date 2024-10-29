import { z } from 'zod';

export const createAttributeValueDtoSchema = z.object({
  id: z.number().optional(),
  value: z.string().optional(),
  meta: z.string().optional(),
  language: z.string().optional(),
});

export const createAttributeDtoSchema = z.object({
  name: z.string().nonempty(),
  language: z.string().optional(),
  shop_id: z.number().refine((value) => value !== undefined, {
    message: 'shop_id is required',
    path: ['shop_id'],
  }),
  values: z.array(createAttributeValueDtoSchema).optional(),
});

export type CreateAttributeDto = z.infer<typeof createAttributeDtoSchema>;
