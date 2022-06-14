import { MiddlewareConsumer, Module } from "@nestjs/common";
import { PostsService } from "../services/post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "../entities/post.entity";
import { PostsController } from "../controllers/post.controller";
import { ActionPostEntity } from "../entities/action_post.entity";
import { AuthModule } from "./auth.module";
import { LoggerMiddleware } from "../common/middlewares/logger.middleware";
import { MediaEntity } from "../entities/media.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, ActionPostEntity, MediaEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(PostsController);
  }
}
