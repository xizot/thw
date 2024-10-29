import { Injectable, NotFoundException } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import Fuse from "fuse.js";
import { paginate } from "src/common/pagination/paginate";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { GetReviewsDto, ReviewPaginator } from "./dto/get-reviews.dto";
import reviewJSON from "@db/reviews.json";
import { Review } from "./entities/review.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ShopsService } from "../shops/shops.service";
import { ProductsService } from "../products/products.service";
import { OrdersService } from "../orders/orders.service";
import { UsersService } from "../users/users.service";

const reviews = plainToClass(Review, reviewJSON);
const options = {
  keys: ["product_id"],
  threshold: 0.3
};
const fuse = new Fuse(reviews, options);

@Injectable()
export class ReviewService {
  private reviews: Review[] = reviews;

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly shopsService: ShopsService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService
  ) {
  }

  findAllReviews({ limit, page, search, product_id }: GetReviewsDto) {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Review[] = this.reviews;

    if (search) {
      const parseSearchParams = search.split(";");
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(":");
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    if (product_id) {
      data = data.filter((p) => p.product.id === Number(product_id));
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/reviews?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url)
    };
  }

  findReview(id: string) {
    return this.reviews.find((p) => p.id === id);
  }

  async create(createReviewDto: CreateReviewDto, userID: string): Promise<Review> {
    const { shop_id, product_id, order_id, ...reviewData } = createReviewDto;

    const promises = [];
    if (shop_id) promises.push(this.shopsService.findOne(shop_id));

    if (product_id) promises.push(this.productsService.findOne(product_id));

    if (order_id) promises.push(this.ordersService.findOne(order_id));


    const [shopExists, productExists, orderExists] = await Promise.all(promises);

    if (shop_id && !shopExists) throw new NotFoundException("Shop not found");

    if (product_id && !productExists) throw new NotFoundException("Product not found");

    if (order_id && !orderExists) throw new NotFoundException("Order not found");


    if (!await this.usersService.findOne(userID)) throw new NotFoundException("User not found");


    const review = this.reviewRepository.create({
      ...reviewData,
      order: orderExists,
      shop: shopExists,
      product: productExists,
      user: { id: userID }
    });

    return this.reviewRepository.save(review);
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return this.reviews[0];
  }

  delete(id: number) {
    return this.reviews[0];
  }
}
