import { UserModule } from "./users.module";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppService } from "../services/app.service";
import { AuthModule } from "./auth.module";
import { config } from "dotenv";
import { MailModule } from "./mail.module";
import { PostModule } from "./post.module";
import { DbModule } from "./db.module";
import { ChatModule } from "./chat.module";
import { LoggerMiddleware } from "../common/middlewares/logger.middleware";

config();

@Module({
  imports: [
    DbModule,
    AuthModule,
    MailModule,
    PostModule,
    UserModule,
    ChatModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
