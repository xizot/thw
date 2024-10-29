import { Module } from '@nestjs/common';
import { HeartbeatService } from './heartbeat.service';
import { HeartbeatController } from './heartbeat.controller';

@Module({
  providers: [HeartbeatService],
  controllers: [HeartbeatController]
})
export class HeartbeatModule {}
