import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message, details } = this.parseException(exception);

    // Format per PRD: { "error": "...", "statusCode": 400, "details": "..." }
    const errorResponse = {
      error: this.getErrorName(status),
      statusCode: status,
      details: details || message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private parseException(exception: unknown): {
    status: number;
    message: string | object;
    details: unknown;
  } {
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    return this.handleUnknownException(exception);
  }

  private handleHttpException(exception: HttpException): {
    status: number;
    message: string | object;
    details: unknown;
  } {
    const status = exception.getStatus();
    let message: string | object = 'Internal server error';
    let details: unknown = null;

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as Record<string, unknown>;
      if (typeof responseObj.message === 'string') {
        message = responseObj.message;
      } else if (typeof responseObj.error === 'string') {
        message = responseObj.error;
      }
      details = responseObj.message; // NestJS validation errors usually put array of errors in 'message'
    }

    return { status, message, details };
  }

  private handleUnknownException(exception: unknown): {
    status: number;
    message: string | object;
    details: unknown;
  } {
    // Log internal server errors
    this.logger.error(
      `Internal Server Error: ${exception instanceof Error ? exception.message : exception}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      details: null,
    };
  }

  private getErrorName(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}
