import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UsePipes, Req
} from "@nestjs/common";
import { ShopsService } from './shops.service';
import { GetShopsDto, ShopPaginator } from './dto/get-shops.dto';
import { GetStaffsDto } from './dto/get-staffs.dto';
import { UserPaginator } from 'src/users/dto/get-users.dto';
import { AuthGuard } from 'src/auth/decorator/auth.decorator';
import { RolesGuard } from 'src/auth/decorator/roles.decorator';
import { Permission } from 'shop-shared/dist/auth';
import {
  CreateShopDto,
  CreateShopSchema,
  UpdateShopDto,
  UpdateShopSchema
} from 'shop-shared/dist/shop';
import { ZodValidationPipe } from 'src/zod-validation.pipe';
import { Request } from "express";

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateShopSchema))
  @RolesGuard(Permission.SUPER_ADMIN)
  @AuthGuard()
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopsService.create(createShopDto);
  }

  @Get()
  @RolesGuard(Permission.SUPER_ADMIN)
  @AuthGuard()
  async getShops(@Query() query: GetShopsDto): Promise<ShopPaginator> {
    return this.shopsService.getShops(query);
  }

  @Get("owner")
  @RolesGuard(Permission.STORE_OWNER)
  @AuthGuard()
  async getShopByOwnerId(@Req() request: Request) {
    return this.shopsService.getShopByOwner(request.user.id);
  }

  @Get(':slug')
  async getShop(@Param('slug') slug: string) {
    return this.shopsService.getShop(slug);
  }

  @Put(":id")
  @UsePipes(new ZodValidationPipe(UpdateShopSchema))
  @RolesGuard(Permission.STORE_OWNER)
  @AuthGuard()
  update(@Param("id") id: string, @Body() updateShopDto: UpdateShopDto, @Req() request: Request) {
    return this.shopsService.update(+id, updateShopDto, request.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(+id);
  }

  @Post('approve')
  approveShop(@Param('id') id: string) {
    return this.shopsService.approve(+id);
  }

  @Post('disapprove')
  disapproveShop(@Param('id') id: string) {
    return this.shopsService.approve(+id);
  }
}

@Controller('staffs')
export class StaffsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @RolesGuard(Permission.SUPER_ADMIN)
  @AuthGuard()
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopsService.create(createShopDto);
  }

  @Get()
  async getStaffs(@Query() query: GetStaffsDto): Promise<UserPaginator> {
    return this.shopsService.getStaffs(query);
  }

  @Get(':slug')
  async getShop(@Param('slug') slug: string) {
    return this.shopsService.getShop(slug);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
  //   return this.shopsService.update(+id, updateShopDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(+id);
  }
}

@Controller('disapprove-shop')
export class DisapproveShopController {
  constructor(private shopsService: ShopsService) {}

  @Post()
  async disapproveShop(@Body('id') id) {
    return this.shopsService.disapproveShop(id);
  }
}

@Controller('approve-shop')
export class ApproveShopController {
  constructor(private shopsService: ShopsService) {}

  @Post()
  async approveShop(@Body('id') id) {
    return this.shopsService.approveShop(id);
  }
}
