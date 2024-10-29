import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodSchema<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const result = this.schema.safeParse(value);

    if (result.success === false) {
      throw new UnprocessableEntityException(result.error);
    }
    return result.data;
  }
}
