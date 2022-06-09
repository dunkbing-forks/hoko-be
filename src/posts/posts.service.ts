import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Posts, Privacy } from "../entities/post.entity";
import { ActionsPost } from "../entities/actions_post.entity";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Media } from "../entities/media.entity";
const moment = require("moment");

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(ActionsPost)
    private readonly actionsPostRepository: Repository<ActionsPost>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>
  ) {}

  async getPosts(): Promise<Posts[]> {
    return this.postsRepository
      .createQueryBuilder("posts")
      .where("posts.active = :active", { active: true })
      .getMany();
  }

  async createPost(post: CreatePostDto): Promise<Posts> {
    const postEntity = new Posts();
    postEntity.title = post.title;
    postEntity.description = post.description;
    postEntity.contents = post.contents;

    postEntity.privacy = post.privacy;
    postEntity.ownerId = post.ownerId;
    postEntity.active = true;
    const utc = moment.utc().format("YYYY-MM-DD HH:mm:ss");
    postEntity.createdAt = new Date(utc);
    postEntity.updatedAt = new Date(utc);

    const currentPost = await this.postsRepository.save(postEntity);

    for (const media of post.medias) {
      const newMedia = new Media();
      newMedia.url = media.url;
      newMedia.extension = media.extension;
      newMedia.mediaType = media.mediaType;
      newMedia.postId = currentPost.id;
      newMedia.createdAt = new Date(utc);
      newMedia.updatedAt = new Date(utc);
      await this.mediaRepository.save(newMedia);
    }
    return currentPost;
  }

  async updatePost(post: UpdatePostDto): Promise<Posts> {
    const currentPost = await this.postsRepository.findOne(post.postId);

    if (currentPost) {
      currentPost.title = post.title;
      currentPost.description = post.description;
      currentPost.contents = post.contents;

      if (post.medias.length > 0) {
        const mediaOfPost = await this.mediaRepository
          .createQueryBuilder("media")
          .where("media.postId = :postId", { postId: currentPost.id })
          .getMany();

        for (const media of mediaOfPost) {
          await media.remove();
        }

        for (const media of post.medias) {
          const newMedia = new Media();
          newMedia.url = media.url;
          newMedia.extension = media.extension;
          await newMedia.save();
        }
      }

      currentPost.privacy = post.privacy;

      const utc = moment.utc().format("YYYY-MM-DD HH:mm:ss");
      currentPost.updatedAt = new Date(utc);
      return currentPost.save();
    }
    return null;
  }

  async deletePost(post: Posts): Promise<Posts> {
    post.active = false;
    return this.postsRepository.save(post);
  }

  async getPostByUserId(userId: number): Promise<Posts[]> {
    return this.postsRepository
      .createQueryBuilder("posts")
      .where("posts.ownerId = :userId", { userId })
      .andWhere("active = :active", { active: true })
      .getMany();
  }

  async getTop5Posts(): Promise<Posts[]> {
    return this.postsRepository
      .createQueryBuilder("posts")
      .where("posts.active = :active", { active: true })
      .orderBy("posts.updated_at", "DESC")
      .limit(5)
      .getMany();
  }

  async getViralPosts(): Promise<Posts[]> {
    const countActions = await this.postsRepository
      .createQueryBuilder("posts")
      .leftJoinAndSelect("posts.actionsPost", "actionsPost")
      .where("posts.active = :active", { active: true })
      .addSelect("COUNT(actionsPost.postId) as countActions")
      .orderBy("countActions", "DESC")
      .limit(5)
      .getMany();

    const topFive = await this.postsRepository
      .createQueryBuilder("posts")
      .where("posts.active = :active", { active: true })
      .orderBy("posts.updated_at", "DESC")
      .limit(5)
      .getMany();

    return countActions.concat(topFive);
  }
}
