import { UserModule } from "./users.module";
import { Module } from "@nestjs/common";
import { AppController } from "../controllers/app.controller";
import { AppService } from "../services/app.service";
import { AuthModule } from "./auth.module";
import { config } from "dotenv";
import { MailModule } from "./mail.module";
import { PostModule } from "./post.module";
import { DbModule } from "./db.module";
import { ChatModule } from "./chat.module";

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
