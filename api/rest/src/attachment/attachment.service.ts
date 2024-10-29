import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '../common/entities/attachment.entity';
import { Repository } from 'typeorm';
import { z } from 'zod';
import { attachmentSchema } from 'src/types/dto/create-type.dto';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async createAttachment(
    data: z.infer<typeof attachmentSchema>,
  ): Promise<Attachment> {
    return this.attachmentRepository.save(data);
  }

  async createMultipleAttachments(
    attachments: z.infer<typeof attachmentSchema>[],
  ): Promise<Attachment[]> {
    return await this.attachmentRepository.save(attachments);
  }
}
