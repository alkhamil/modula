import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

/** Ubah semua error menjadi envelope standar `{ response_schema, response_output: null }`. */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = exception instanceof HttpException ? exception.getResponse() : null;
    const rawMessage =
      typeof body === 'string'
        ? body
        : (body as { message?: unknown } | null)?.message;
    const message = Array.isArray(rawMessage)
      ? rawMessage.map(String).join('; ')
      : String(rawMessage ?? 'Terjadi kesalahan server.');
    res.status(status).json({
      response_schema: { response_code: String(status), response_message: message },
      response_output: null,
    });
  }
}
