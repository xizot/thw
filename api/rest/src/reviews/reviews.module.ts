import { Module } from "@nestjs/common";
import { AbusiveReportsController } from "./reports.controller";
import { AbusiveReportService } from "./reports.service";
import { ReviewController } from "./reviews.controller";
import { ReviewService } from "./reviews.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { ShopsModule } from "../shops/shops.module";
import { ProductsModule } from "../products/products.module";
import { OrdersModule } from "../orders/orders.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Review]), ShopsModule, ProductsModule, OrdersModule, UsersModule],
  controllers: [ReviewController, AbusiveReportsController],
  providers: [ReviewService, AbusiveReportService]
})
export class ReviewModule {
}
