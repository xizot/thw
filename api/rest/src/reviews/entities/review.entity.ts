import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/entities/user.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { Report } from './reports.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { Column, Entity, ManyToOne } from "typeorm";
import { Product } from "../../products/entities/product.entity";

@Entity()
export class Review extends CoreEntity {
  @Column({ default: 0 })
  rating: number;

  // name: string;

  @Column({ nullable: true })
  comment?: string;

  @ManyToOne(() => Shop, (shop) => shop.reviews, { onDelete: "CASCADE" })
  shop: Shop;

  @ManyToOne(() => Order, (order) => order.reviews, { onDelete: "CASCADE" })
  order: Order;

  // customer: User;

  // photos: Attachment[];

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Product, (product) => product.my_review, { onDelete: "CASCADE" })
  product: Product;

  // feedbacks: Feedback[];
  // my_feedback: Feedback;
  // positive_feedbacks_count: number;
  // negative_feedbacks_count: number;
  // user_id: number;
  // product_id: number;
  // abusive_reports: Report[];
  // shop_id: string;
  // variation_option_id: string;
  // abusive_reports_count?: number;
}
