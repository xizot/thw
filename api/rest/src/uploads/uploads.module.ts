import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  // imports: [
  //   ThrottlerModule.forRoot({
  //     ttl: 60,
  //     limit: 10,
  //   }),
  // ],
  controllers: [UploadsController],
  providers: [
    UploadsService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class UploadsModule {}
