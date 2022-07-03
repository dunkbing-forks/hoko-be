import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { ServerOptions } from "socket.io";

import { AllExceptionsFilter } from "@common/middlewares/exception-filter";
import { AppModule } from "./modules";
import config from "@common/config";
import {getLogLevels} from "@common/utils";

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  private logger = new Logger(RedisIoAdapter.name);

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: "redis://localhost:6379" });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      this.logger.log(`Connected to Redis: ${pubClient.isReady}, ${subClient.isReady}`);
    });

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}

async function bootstrap() {
  const logger = new Logger("bootstrap");
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: getLogLevels(config.nodeEnv !== "production"),
  });
  app.enableCors({
    origin: [config.feOrigin, config.meetOrigin],
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(config.port);
  logger.log(`Server running on: ${await app.getUrl()}`);
}

void bootstrap();
