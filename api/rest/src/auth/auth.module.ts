import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JsonWebTokenStrategy } from './strategies/jwtStrategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';
import { AddressesModule } from 'src/addresses/addresses.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_KEY,
    }),
    RedisModule,
    MailModule,
    AddressesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JsonWebTokenStrategy],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
