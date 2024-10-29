import { PickType } from '@nestjs/swagger';
import { Feedback } from '../entities/feedback.entity';

export class CreateFeedbackDto extends PickType(Feedback, [
  'model_id',
  'model_type',
  'positive',
  'negative',
]) {}
