import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { DateTime, Interval } from 'luxon';
import { v4 as uuid } from 'uuid';

@Injectable()
export class HttpReqResLoggingMiddleware implements NestMiddleware {
  logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const start = DateTime.now();

    res.on('finish', () => {
      const end = DateTime.now();
      const duration = Interval.fromDateTimes(start, end)
        .toDuration('milliseconds')
        .toHuman({ unitDisplay: 'short' });
      const message = {
        id: uuid(),
        method,
        resource: originalUrl,
        status: res.statusCode,
        duration: `${duration}`,
        ip: this.getClientIp(req),
      };

      if (originalUrl === '/health' && res.statusCode === 200) {
        return;
      }

      this.logger.log(message);
    });

    next();
  }

  private getClientIp(req: Request): string {
    // Check X-Forwarded-For header
    const forwardedFor = req.header('X-Forwarded-For');
    if (forwardedFor) {
      // Get the first IP in the chain
      return forwardedFor.split(',')[0].trim();
    }

    // Check other common headers
    const realIp = req.header('X-Real-IP');
    if (realIp) {
      return realIp;
    }

    // Fall back to connection remote address
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
}
