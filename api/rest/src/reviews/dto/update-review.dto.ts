import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto, createReviewSchema } from "./create-review.dto";
import { z } from "zod";

// export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

export type UpdateReviewDto = z.infer<typeof createReviewSchema>;
