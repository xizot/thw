import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse();
    // Log the exception details
    this.logger.error(
      `HTTP Exception occurred: ${JSON.stringify(error)}, status: ${status}`,
    );
    // Customize the response format here
    const formattedError = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
    };

    response.status(status).json(formattedError);
  }
}
