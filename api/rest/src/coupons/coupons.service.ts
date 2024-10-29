import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateCouponDto } from 'shop-shared/dist/coupon';
import { Coupon } from './entities/coupon.entity';
import couponsJson from '@db/coupons.json';
import Fuse from 'fuse.js';
import { GetCouponsDto } from './dto/get-coupons.dto';
import { paginate } from 'src/common/pagination/paginate';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthPayloadResponse } from 'shop-shared/dist/auth';
import { ShopsService } from 'src/shops/shops.service';
import { RedisService } from 'src/redis/redis.service';
import RedisTemplate from 'src/redis/redis.templates';
import { OnEvent } from '@nestjs/event-emitter';
import { AttachmentFieldEnum } from 'shop-shared/dist/attachment';

const coupons = plainToClass(Coupon, couponsJson);
const options = {
  keys: ['code'],
  threshold: 0.3,
};
const fuse = new Fuse(coupons, options);

@Injectable()
export class CouponsService {
  private coupons: Coupon[] = coupons;
  constructor(
    @InjectRepository(Coupon)
    private readonly couponsRepository: Repository<Coupon>,
    private readonly shopsService: ShopsService,
    private readonly redisService: RedisService,
  ) {}

  async create(
    createCouponDto: CreateCouponDto,
    user: AuthPayloadResponse,
  ): Promise<Coupon> {
    const existingShop = await this.shopsService.getShopByOwner(user.id);
    if (!existingShop) {
      throw new NotFoundException("You don't have any shops.");
    }

    const existingCoupon = await this.getCouponByCodeAndShopId(
      createCouponDto.code,
      existingShop.id,
    );
    if (existingCoupon) {
      throw new ConflictException('The code is already in your shop.');
    }

    const savedCoupon = await this.couponsRepository.save(createCouponDto);
    const key = RedisTemplate.buildCouponImageKey(user.id, savedCoupon.id);
    await this.redisService.setAsync(key, savedCoupon.id, 60);
    return savedCoupon;
  }

  @OnEvent(AttachmentFieldEnum.COUPON_IMAGE)
  async updateLogo(data: {
    url: string;
    userId: string;
    id?: number | string;
  }) {
    const key = RedisTemplate.buildCouponImageKey(data.userId, data.id || '*');
    const couponId = await this.redisService.findOneByPatternAsync<
      string | number
    >(key);
    if (couponId) {
      await this.couponsRepository.update(couponId, { image: data.url });
    }
    await this.redisService.removeAllByPatternAsync(key);
  }

  async getCoupons({ search, limit, page }: GetCouponsDto) {
    if (!page) page = 1;
    if (!limit) limit = 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Coupon[] = await this.couponsRepository.find();
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }

    if (search) {
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // TODO: Temp Solution
        if (key !== 'slug') {
          searchText.push({
            [key]: value,
          });
        }
      }

      // data = fuse
      //   .search({
      //     $and: searchText,
      //   })
      //   ?.map(({ item }) => item);
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/coupons?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getCoupon(param: string, language: string): Coupon {
    return this.coupons.find((p) => p.code === param);
  }

  async remove(id: number, user: AuthPayloadResponse) {
    const existingShop = await this.shopsService.getShopByOwner(user.id);
    if (!existingShop) {
      throw new NotFoundException("You don't have any shops.");
    }
    const existingCoupon: Coupon = await this.getCouponById(id);
    if (!existingCoupon || existingCoupon.shop.id != existingShop.id) {
      throw new ForbiddenException("You don't have permission.");
    }
    return this.couponsRepository.remove(existingCoupon);
  }
  async getCouponById(id: number): Promise<Coupon> {
    return this.couponsRepository.findOne({
      where: {
        id,
      },
      relations: {
        shop: true,
      },
    });
  }
  async getCouponByCodeAndShopId(
    code: string,
    shopId: string | number,
  ): Promise<Coupon> {
    return this.couponsRepository.findOne({
      where: {
        code,
        shop: {
          id: shopId,
        },
      },
    });
  }

  verifyCoupon(code: string) {
    return {
      is_valid: true,
      coupon: {
        id: 9,
        code: code,
        description: null,
        image: {
          id: 925,
          original:
            'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/925/5x2x.png',
          thumbnail:
            'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/925/conversions/5x2x-thumbnail.jpg',
        },
        type: 'fixed',
        amount: 5,
        active_from: '2021-03-28T05:46:42.000Z',
        expire_at: '2024-06-23T05:46:42.000Z',
        created_at: '2021-03-28T05:48:16.000000Z',
        updated_at: '2021-08-19T03:58:34.000000Z',
        deleted_at: null,
        is_valid: true,
      },
    };
  }
}
