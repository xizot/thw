import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import {
  ApproveShopController,
  DisapproveShopController,
  ShopsController,
  StaffsController,
} from './shops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { Balance } from './entities/balance.entity';
import { ShopSettings } from './entities/shop-setting.entity';
import { PaymentInfo } from './entities/payment-info.entity';
import { RedisModule } from 'src/redis/redis.module';
import { ShopSocials } from 'src/settings/entities/shop-social.entity';
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shop,
      Address,
      Attachment,
      PaymentInfo,
      ShopSettings,
      ShopSocials,
    ]),
    RedisModule,
    UsersModule
  ],
  controllers: [
    ShopsController,
    StaffsController,
    DisapproveShopController,
    ApproveShopController,
  ],
  providers: [ShopsService],
  exports: [ShopsService]
})
export class ShopsModule {}
