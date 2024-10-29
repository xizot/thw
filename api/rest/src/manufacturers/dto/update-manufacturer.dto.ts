import { PartialType } from "@nestjs/swagger";
import { CreateManufacturerDto, createManufacturerDtoSchema } from "./create-manufacturer.dto";
import { z } from "zod";

// export class UpdateManufacturerDto extends PartialType(CreateManufacturerDto) {}

export const updateManufacturerDtoSchema = createManufacturerDtoSchema
  .pick({
    type_id: true,
    name: true,
    language: true,
    description: true,
    socials: true,
    website: true
  })
  .extend({
    name: z.string().optional(),
    language: z.string().optional()
  });

export type UpdateManufacturerDto = z.infer<typeof updateManufacturerDtoSchema>;
