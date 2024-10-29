import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { Coupon } from './entities/coupon.entity';
import { ShopsModule } from 'src/shops/shops.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon]), ShopsModule, RedisModule],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule { }
