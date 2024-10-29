import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { AuthenticationGuard } from 'src/auth/guards/authGuard';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/decorator/auth.decorator';
import { UpdateProfileDto } from 'shop-shared/dist/users';
import { CoreResponse } from 'src/auth/dto/create-auth.dto';
import { RolesGuard } from 'src/auth/decorator/roles.decorator';
import { Permission } from 'shop-shared/dist/auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RolesGuard(Permission.SUPER_ADMIN)
  @AuthGuard()
  getAllUsers(@Query() query: GetUsersDto) {
    return this.usersService.getUsers(query);
  }

  @Get("owners")
  @RolesGuard(Permission.SUPER_ADMIN)
  @AuthGuard()
  getAllOwners() {
    return this.usersService.getOwners();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  updateUser(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto, request.user);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('unblock-user')
  activeUser(@Body('id') id: string) {
    return this.usersService.activeUser(id);
  }

  @Post('block-user')
  banUser(@Body('id') id: string) {
    return this.usersService.banUser(id);
  }

  @Post('make-admin')
  makeAdmin(@Param('user_id') id: string) {
    return this.usersService.makeAdmin(id);
  }
}

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  @AuthGuard()
  updateProfile(
    @Req() request: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<CoreResponse> {
    return this.usersService.updateProfile(updateProfileDto, request.user);
  }

  @Delete(':id')
  deleteProfile(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
