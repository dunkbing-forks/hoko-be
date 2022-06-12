import { IsString, IsNumber } from "class-validator";
import { Privacy } from "../entities/post.entity";
import { MediaType } from "../common/types";

export class UpdatePostDto {
  @IsString()
  readonly content: string;

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
  readonly content: string;

  @IsString()
  readonly medias: MediaType[];

  @IsString()
  readonly description: string;

  @IsString()
  readonly privacy: Privacy;
}
