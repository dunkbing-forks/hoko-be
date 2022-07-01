import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { config } from "dotenv";

import { AllExceptionsFilter } from "@common/middlewares/exception-filter";
import { AppModule } from "./modules";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV !== "production",
  });
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.APP_PORT);
}

void bootstrap();
