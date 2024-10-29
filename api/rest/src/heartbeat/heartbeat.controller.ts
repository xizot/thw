import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HeartbeatController {
  constructor() {}

  @Get('/')
  getHeartbeat(): string {
    return 'OK';
  }
}
