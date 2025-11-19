import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;
        details = responseObj.message; // NestJS validation errors usually put array of errors in 'message'
      }
    } else {
      // Log internal server errors
      this.logger.error(
        `Internal Server Error: ${exception instanceof Error ? exception.message : exception}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

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

  private getErrorName(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return "Bad Request";
      case HttpStatus.NOT_FOUND:
        return "Not Found";
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return "Internal Server Error";
      default:
        return "Error";
    }
  }
}
