import { IsString, IsNumber, IsOptional, IsArray,  } from "class-validator";
import { Privacy } from "../entities/post.entity";
import { MediaType } from "../common/types";

export class UpdatePostDto {
  @IsString()
  readonly content: string;

  @IsString()
  readonly medias: MediaType[];

  @IsString()
  readonly privacy: Privacy;

  @IsNumber()
  readonly ownerId: number;
}

export class CreatePostDto {
  @IsNumber()
  @IsOptional()
  ownerId?: number;

  @IsString()
  readonly content: string;

  @IsArray()
  @IsOptional()
  readonly medias?: MediaType[];

  @IsString()
  readonly privacy: Privacy;
}
