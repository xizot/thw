import { PartialType } from '@nestjs/swagger';
import { CreateTagDto, createTagDtoSchema } from "./create-tag.dto";
import { z } from "zod";

// export class UpdateTagDto extends PartialType(CreateTagDto) {}


export const updateTagDtoSchema = createTagDtoSchema
  .pick({
    type_id: true,
    name: true,
    language: true,
    details: true,
    icon: true,
  })
  .extend({
    name: z.string().optional(),
  });

export type UpdateTagDto = z.infer<typeof updateTagDtoSchema>;
