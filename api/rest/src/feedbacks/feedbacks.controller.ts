import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  Req,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FeedbackService } from './feedbacks.service';
import { ZodValidationPipe } from 'src/zod-validation.pipe';
import {
  CreateFeedBackSchema,
  UpdateFeedBackSchema,
} from 'shop-shared/dist/feedbacks';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/decorator/auth.decorator';
@Controller('feedbacks')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) { }

  @Get()
  @AuthGuard()
  findAll() {
    return this.feedbackService.findAllFeedbacks();
  }

  @Get(':id')
  @AuthGuard()
  find(@Param('id') id: number) {
    return this.feedbackService.findFeedback(id);
  }

  @Post()
  @AuthGuard()
  @UsePipes(new ZodValidationPipe(CreateFeedBackSchema))
  async createFeedback(@Req() request: Request, @Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto, request.user);
  }

  @Put(':id')
  @AuthGuard()
  @UsePipes(new ZodValidationPipe(UpdateFeedBackSchema))
  async updateFeedback(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(id, updateFeedbackDto, request.user);
  }

  @Delete(':id')
  @AuthGuard()
  @UsePipes(new ZodValidationPipe(UpdateFeedBackSchema))
  async delete(@Req() request: Request, @Param('id') id: number) {
    return this.feedbackService.delete(id, request.user);
  }
}
