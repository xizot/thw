import { Attachment } from '../../common/entities/attachment.entity';
import { z } from "zod";

// export class CreateReviewDto {
//   rating: number;
//   comment: string;
//   photos?: Attachment[];
//   product_id: string;
//   shop_id: string;
//   order_id: string;
//   variation_option_id: number;
// }

export const createReviewSchema = z.object({
  rating: z.number(),
  comment: z.string().optional(),
  order_id: z.number().optional(),
  product_id: z.number().refine(value => value !== undefined, {
    message: "product_id is required",
    path: ["product_id"]
  }),
  shop_id: z.number().refine(value => value !== undefined, {
    message: "shop_id is required",
    path: ["shop_id"]
  })
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
