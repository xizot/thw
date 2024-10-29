import { PartialType } from '@nestjs/swagger';
import { CreateAttributeDto, createAttributeDtoSchema } from "./create-attribute.dto";
import { z } from "zod";

// export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {}

export const updateAttributeDtoSchema = createAttributeDtoSchema
  .pick({
    name: true,
    language: true,
    shop_id: true,
    values: true
  })
  .extend({
    name: z.string().optional(),
  });

export type UpdateAttributeDto = z.infer<typeof updateAttributeDtoSchema>;
