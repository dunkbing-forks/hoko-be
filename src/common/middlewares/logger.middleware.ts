import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  logger = new Logger("LoggerMiddleware");
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get("User-Agent");
    res.on("close", () => {
      const { statusCode } = res;
      const contentLength = res.get("Content-Length");

      this.logger.log(
        `${method} | ${originalUrl} | ${statusCode} | ${contentLength} | ${userAgent} | ${ip}`
      );
    });
    next();
  }
}
