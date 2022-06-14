import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PostEntity} from "../entities/post.entity";
import {ActionPostEntity} from "../entities/action_post.entity";
import {CreatePostDto, UpdatePostDto} from "../dto/post.dto";
import {MediaEntity} from "../entities/media.entity";
import {BaseService} from "./base.service";

const moment = require("moment");

@Injectable()
export class PostsService extends BaseService {
  constructor(
    @InjectRepository(PostEntity) private readonly postsRepository: Repository<PostEntity>,
    @InjectRepository(ActionPostEntity) private readonly actionsPostRepository: Repository<ActionPostEntity>,
    @InjectRepository(MediaEntity) private readonly mediaRepository: Repository<MediaEntity>,
  ) {
    super();
  }
	
  async getPosts(): Promise<PostEntity[]> {
    return this.postsRepository
      .createQueryBuilder("posts")
      .where("posts.active = :active", {active: true})
      .getMany();
  }
	
  async createPost(post: CreatePostDto): Promise<PostEntity> {
		
    const postEntity = new PostEntity();
    postEntity.content = post.content;
		
    postEntity.privacy = post.privacy;
    postEntity.ownerId = post.ownerId;
    postEntity.active = true;
    const utc = moment.utc().format("YYYY-MM-DD HH:mm:ss");
    postEntity.createdAt = new Date(utc);
    postEntity.updatedAt = new Date(utc);
		
    const currentPost = await this.postsRepository.save(postEntity);
		
    for (const media of post.medias) {
      const newMedia = new MediaEntity();
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
	
  async updatePost(id: number, post: UpdatePostDto): Promise<PostEntity> {
    const currentPost = await this.postsRepository.findOne(id);
		
    if (currentPost) {
      currentPost.content = post.content;
			
      if (post.medias.length > 0) {
        const mediaOfPost = await this.mediaRepository
          .createQueryBuilder("media")
          .where("media.postId = :postId", {postId: currentPost.id})
          .getMany();
				
        for (const media of mediaOfPost) {
          await media.remove();
        }
				
        for (const media of post.medias) {
          const newMedia = new MediaEntity();
          newMedia.url = media.url;
          newMedia.extension = media.extension;
          newMedia.postId = currentPost.id;
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
	
  async deletePost(post: PostEntity): Promise<PostEntity> {
    post.active = false;
    return this.postsRepository.save(post);
  }
	
  async getPostByUserId(userId: number): Promise<PostEntity[]> {
    return this.postsRepository
      .createQueryBuilder("posts")
      .where("posts.ownerId = :userId", {userId})
      .andWhere("active = :active", {active: true})
      .getMany();
  }
	
  async getTop5Posts(): Promise<PostEntity[]> {
    return this.postsRepository
      .createQueryBuilder("posts")
      .where("posts.active = :active", {active: true})
      .orderBy("posts.updated_at", "DESC")
      .limit(5)
      .getMany();
  }
	
  async getViralPosts(): Promise<PostEntity[]> {
    try {
      await this.startTransaction();
      const countActions = await this.postsRepository
        .createQueryBuilder("posts")
        .leftJoinAndSelect("posts.actions", "actionsPost")
        .where("posts.active = :active", {active: true})
        .addSelect("COUNT(actionsPost.postId) as countActions")
        .orderBy("countActions", "DESC")
        .limit(5)
        .getMany();
			
      const topFive = await this.postsRepository
        .createQueryBuilder("posts")
        .where("posts.active = :active", {active: true})
        .orderBy("posts.updated_at", "DESC")
        .limit(5)
        .getMany();
			
      await this.commitTransaction();
			
      return countActions.concat(topFive);
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    } finally {
      await this.release();
    }
  }
}
