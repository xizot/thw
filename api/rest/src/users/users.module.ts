import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfilesController, UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UsersController, ProfilesController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
