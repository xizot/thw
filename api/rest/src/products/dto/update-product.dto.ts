import { PartialType } from '@nestjs/swagger';
import { CreateProductDto, createProductSchema } from "./create-product.dto";
import { z } from "zod";

// export class UpdateProductDto extends PartialType(CreateProductDto) {}

export type UpdateProductDto = z.infer<typeof createProductSchema>;