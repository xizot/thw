import { Injectable } from '@nestjs/common';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreResponse } from 'src/auth/dto/create-auth.dto';
import { AuthPayloadResponse } from 'shop-shared/dist/auth';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly usersService: UsersService,
  ) { }

  async findAllFeedbacks(): Promise<Feedback[]> {
    const allFeedback = await this.feedbackRepository.find({
      relations: {
        customer: true,
      }
    });
    const allFeedbackWithoutPassword = allFeedback.map(feedback => {
      if (feedback.customer) {
        const { password, ...customer } = feedback.customer;
        return { ...feedback, customer };
      }
      return feedback;
    });
    return allFeedbackWithoutPassword;
  };

  async findFeedback(id: number): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        customer: true,
      },
    });
    delete feedback.customer.password;
    return feedback
  }

  async create(createFeedbackDto: CreateFeedbackDto, user: AuthPayloadResponse): Promise<Feedback> {
    const currentUser = await this.usersService.getUserById(user.id);
    const toCreateFeedback: Feedback = this.feedbackRepository.create(createFeedbackDto);
    toCreateFeedback.customer = currentUser;
    const newFeedback = await this.feedbackRepository.save(toCreateFeedback)
    delete newFeedback.customer.password;
    return newFeedback
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto, user: AuthPayloadResponse): Promise<CoreResponse> {
    const existingFeedback = await this.findFeedback(id)
    if (existingFeedback && existingFeedback.customer.id === user.id) {
      await this.feedbackRepository.save({
        ...existingFeedback,
        ...updateFeedbackDto
      });
      return {
        success: true,
        message: 'Update feedback successfully',
      };
    }
    return {
      success: false,
      message: 'Update feedback failed',
    };
  }

  async delete(id: number, user: AuthPayloadResponse): Promise<CoreResponse> {
    const existingFeedback = await this.findFeedback(id)
    if (existingFeedback && existingFeedback.customer.id === user.id) {
      await this.feedbackRepository.delete(id);
      return {
        success: true,
        message: 'Delete feedback successfully',
      };
    }
    return {
      success: false,
      message: 'Delete feedback failed',
    };
  }
}
