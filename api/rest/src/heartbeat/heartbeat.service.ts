import { Injectable } from '@nestjs/common';

@Injectable()
export class HeartbeatService {
  getHeartbeat(): string {
    return 'OK';
  }
}
