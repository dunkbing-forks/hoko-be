import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsService } from "@services/post.service";
import { PostsController } from "@controllers/post.controller";
import { PostEntity } from "@entities/post.entity";
import { ActionPostEntity } from "@entities/action_post.entity";
import { MediaEntity } from "@entities/media.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, ActionPostEntity, MediaEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostModule {}
