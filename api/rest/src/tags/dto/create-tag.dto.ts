import { PickType } from '@nestjs/swagger';
import { Tag } from '../entities/tag.entity';
import { z } from "zod";

// export class CreateTagDto extends PickType(Tag, [
//   'name',
//   'type',
//   'details',
//   'image',
//   'icon',
//   'language',
// ]) {}

export const createTagDtoSchema = z.object({
  name: z.string().nonempty(),
  details: z.string().optional(),
  icon: z.string().optional(),
  language: z.string().optional(),
  type_id: z.number().refine(value => value !== undefined, {
    message: 'type_id is required',
    path: ['type_id'],
  })
});

export type CreateTagDto = z.infer<typeof createTagDtoSchema>;
