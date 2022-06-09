import { UserModule } from "./users/users.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { config } from "dotenv";
import { MailModule } from "./mail/mail.module";
import { AutoEncryptSubscriber } from "typeorm-encrypted";
import { PostsController } from "./posts/posts.controller";
import { PostsModule } from "./posts/posts.module";

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      synchronize: true,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      logging: false,
      autoLoadEntities: true,
      entities: [join(__dirname, "**/**.entity{.ts,.js}")],
      subscribers: [AutoEncryptSubscriber],
    }),
    AuthModule,
    MailModule,
    PostsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
