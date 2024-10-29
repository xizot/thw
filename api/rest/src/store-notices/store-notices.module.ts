import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { StoreNoticesController } from './store-notices.controller';
import { StoreNoticesService } from './store-notices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Profile } from 'src/users/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [StoreNoticesController],
  providers: [StoreNoticesService, UsersService],
})
export class StoreNoticesModule { }
