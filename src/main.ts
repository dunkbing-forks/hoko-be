import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import * as cookieParser from "cookie-parser";
import { config } from "dotenv";
import { AllExceptionsFilter } from "./common/middlewares/exception-filter";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.APP_PORT);
}
bootstrap();
