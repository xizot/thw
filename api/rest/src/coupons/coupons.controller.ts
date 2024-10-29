import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { GetCouponsDto } from './dto/get-coupons.dto';
import { AuthGuard } from 'src/auth/decorator/auth.decorator';
import { RolesGuard } from 'src/auth/decorator/roles.decorator';
import { Permission } from 'shop-shared/dist/auth';
import { CreateCouponDto, CreateCouponSchema } from 'shop-shared/dist/coupon';
import { Request } from 'express';
import { ZodValidationPipe } from 'src/zod-validation.pipe';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateCouponSchema))
  @RolesGuard(Permission.STORE_OWNER, Permission.SUPER_ADMIN)
  @AuthGuard()
  createCoupon(
    @Req() request: Request,
    @Body() createCouponDto: CreateCouponDto,
  ) {
    return this.couponsService.create(createCouponDto, request.user);
  }

  @Get()
  getCoupons(@Query() query: GetCouponsDto) {
    return this.couponsService.getCoupons(query);
  }

  @Get(':param')
  getCoupon(
    @Param('param') param: string,
    @Query('language') language: string,
  ) {
    return this.couponsService.getCoupon(param, language);
  }

  @Get(':id/verify')
  verify(@Param('param') param: string, @Query('language') language: string) {
    return this.couponsService.getCoupon(param, language);
  }

  @Post('verify')
  verifyCoupon(@Body('code') code: string) {
    return this.couponsService.verifyCoupon(code);
  }

  @Delete(':id')
  @RolesGuard(Permission.STORE_OWNER, Permission.SUPER_ADMIN)
  @AuthGuard()
  deleteCoupon(@Req() request: Request, @Param('id') id: string) {
    return this.couponsService.remove(+id, request.user);
  }
}
