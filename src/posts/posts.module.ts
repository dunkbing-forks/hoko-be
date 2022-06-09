import { MiddlewareConsumer, Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "../entities/post.entity";
import { PostsController } from "./posts.controller";
import { ActionsPost } from "../entities/actions_post.entity";
import { AuthModule } from "../auth/auth.module";
import { LoggerMiddleware } from "../common/middleware/logger.middleware";
import { Media } from "../entities/media.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Posts, ActionsPost, Media]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(PostsController);
  }
}
