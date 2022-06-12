import { UserModule } from "./users.module";
import { Module } from "@nestjs/common";
import { AppController } from "../controllers/app.controller";
import { AppService } from "../services/app.service";
import { AuthModule } from "./auth.module";
import { config } from "dotenv";
import { MailModule } from "./mail.module";
import { PostsModule } from "./posts.module";
import { DbModule } from "./db.module";

config();

@Module({
  imports: [DbModule, AuthModule, MailModule, PostsModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
