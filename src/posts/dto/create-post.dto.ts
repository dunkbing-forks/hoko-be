import { IsString, IsNumber } from "class-validator";
import { Privacy } from "../../entities/post.entity";
import { mediaType } from "../../constant_type";

export class CreatePostDto {
  @IsNumber()
  ownerId?: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly contents: string;

  @IsString()
  readonly medias: mediaType[];

  @IsString()
  readonly description: string;

  @IsString()
  readonly privacy: Privacy;
}
