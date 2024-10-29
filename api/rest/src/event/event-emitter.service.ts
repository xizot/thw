import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  emitEvent(event: string, data: unknown) {
    this.eventEmitter.emit(event, data);
  }
}
