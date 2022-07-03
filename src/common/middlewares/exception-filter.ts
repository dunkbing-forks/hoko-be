import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger = new Logger("ExceptionFilter");
  catch(exception: any, host: ArgumentsHost): void {
    this.logger.error(JSON.stringify(exception));
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const timestamp = new Date().toISOString();
    const path = request.url;

    if (exception instanceof BadRequestException) {
      const exRes = exception.getResponse().valueOf();
      const exResJson = typeof exRes === "object" ? exRes : { error: exRes };
      response.status(status).json({
        success: false,
        timestamp,
        path,
        ...exResJson,
      });
      return;
    }

    const message = exception.message;
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
