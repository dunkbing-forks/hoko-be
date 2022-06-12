import { IsString, IsNumber } from "class-validator";
import { Privacy } from "../entities/post.entity";
import { MediaType } from "../common/types";

export class UpdatePostDto {
  @IsNumber()
  readonly postId: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly contents: string;

  @IsString()
  readonly medias: MediaType[];

  @IsString()
  readonly description: string;

  @IsString()
  readonly privacy: Privacy;

  @IsNumber()
  readonly ownerId: number;
}

export class CreatePostDto {
  @IsNumber()
  ownerId?: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly contents: string;

  @IsString()
  readonly medias: MediaType[];

  @IsString()
  readonly description: string;

  @IsString()
  readonly privacy: Privacy;
}
