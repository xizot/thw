import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  UsePipes,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, CreateAddressSchema, UpdateAddressDto, UpdateAddressSchema } from 'shop-shared/dist/addresses';
import { AuthGuard } from 'src/auth/decorator/auth.decorator';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/decorator/roles.decorator';
import { Permission } from 'shop-shared/dist/auth';
import { ZodValidationPipe } from 'src/zod-validation.pipe';

@Controller('address')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) { }

  @Get()
  @RolesGuard(Permission.SUPER_ADMIN)
  @AuthGuard()
  addresses(@Req() request: Request) {
    return this.addressesService.findAll(request.user);
  }

  @Get(':id')
  @AuthGuard()
  address(@Req() request: Request, @Param('id') id: string) {
    return this.addressesService.findOne(+id, request.user);
  }

  @Post()
  @AuthGuard()
  @UsePipes(new ZodValidationPipe(CreateAddressSchema))
  createAddress(
    @Req() request: Request,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.createAddress(createAddressDto, request.user);
  }

  @Put(':id')
  @AuthGuard()
  @UsePipes(new ZodValidationPipe(UpdateAddressSchema))
  updateAddress(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(+id, updateAddressDto, request.user);
  }

  @Delete(':id')
  @AuthGuard()
  deleteAddress(@Req() request: Request, @Param('id') id: string) {
    return this.addressesService.remove(+id, request.user);
  }
}
