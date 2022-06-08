import { IsString, IsNumber } from "class-validator";
import { Privacy } from "../../entities/post.entity";
import {mediaType} from "../../constant_type";

export class UpdatePostDto {
	@IsNumber()
	readonly postId: number;

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

	@IsNumber()
	readonly ownerId: number;
}
