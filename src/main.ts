import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

import { AllExceptionsFilter } from "@common/middlewares/exception-filter";
import { AppModule } from "./modules";
import config from "@common/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: config.nodeEnv !== "production",
  });
  app.enableCors({
    origin: config.corsOrigin,
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(config.port);
}

void bootstrap();
