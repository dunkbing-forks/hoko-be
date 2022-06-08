import {Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import {PostsService} from "./posts.service";
import {CreatePostDto} from "./dto/create-post.dto";
import {Response, Request} from 'express';
import {AuthService} from "../auth/auth.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {UpdatePostDto} from "./dto/update-post.dto";
import {responseForm} from "../constant_type";

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly authService: AuthService,
	) {
	}

	@Get('/list-post')
	async getPostsByUser(
		@Req() req: Request,
		@Res() res: Response,
	) {
		const user = this.authService.verifyToken(req.cookies.token.jwt_token);
		const data = await this.postsService.getPostByUserId(user.sub);
		const response: responseForm = {
			message: 'Get post success',
			error: false,
			data,
		}
		return res.status(HttpStatus.OK).send(response);
	}

	@Post('/create')
	async createPost(
		@Req() req: Request,
		@Body() post: CreatePostDto,
		@Res() res: Response
	) {
		const user = this.authService.verifyToken(req.cookies.token.jwt_token);
		post.ownerId = user.sub;
		const data = await this.postsService.createPost(post);

		const response: responseForm = {
			message: 'Create post success',
			error: false,
			data,
		}

		return res.status(HttpStatus.OK).send(response);
	}

	@Put('/update')
	async updatePost(
		@Req() req: Request,
		@Body() post: UpdatePostDto,
		@Res() res: Response
	) {
		const data = await this.postsService.updatePost(post);
		if (!data) {
			const response: responseForm = {
				message: 'Post not found',
				error: true,
				data,
			}

			return res.status(HttpStatus.BAD_REQUEST).send(response);
		}
		const response: responseForm = {
			message: 'Update post success',
			error: false,
			data,
		}
		return res.status(HttpStatus.OK).send(response)
	}
}
