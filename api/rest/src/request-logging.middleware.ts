import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTimestamp = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTimestamp;
      this.logger.log(
        `${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
