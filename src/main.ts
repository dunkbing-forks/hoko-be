import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { config } from "dotenv";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: `http://localhost:${process.env.APP_PORT}`,
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  await app.listen(process.env.APP_PORT);
}
bootstrap();
