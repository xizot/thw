import { Module } from '@nestjs/common';
import { FeedbackController } from './feedbacks.controller';
import { FeedbackService } from './feedbacks.service';
import { Feedback } from './entities/feedback.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), UsersModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
