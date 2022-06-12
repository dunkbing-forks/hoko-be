import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "../services/post.service";
import { Response, Request } from "express";
import { AuthService } from "../services/auth.service";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { ResponseForm } from "../common/types";
import { BaseController } from "./base-controller";
import { UpdatePostDto, CreatePostDto } from "../dto/post.dto";

@UseGuards(JwtAuthGuard)
@Controller("posts")
export class PostsController extends BaseController {
  constructor(
    private readonly postsService: PostsService,
    private readonly authService: AuthService
  ) {
    super();
  }

  @Get("/list-post")
  async getPostsByUser(@Req() req: Request, @Res() res: Response) {
    const user = this.authService.verifyToken(req.cookies.token.jwt_token);
    const data = await this.postsService.getPostByUserId(user.sub);
    return res.status(HttpStatus.OK).send(this.toJson(data));
  }

  @Post("/create")
  async createPost(
    @Req() req: Request,
    @Body() post: CreatePostDto,
    @Res() res: Response
  ) {
    const user = this.authService.verifyToken(req.cookies.token.jwt_token);
    post.ownerId = user.sub;
    const data = await this.postsService.createPost(post);

    const response: ResponseForm = {
      message: "Create post success",
      error: false,
      data,
    };

    return res.status(HttpStatus.OK).send(response);
  }

  @Put("/update")
  async updatePost(
    @Req() req: Request,
    @Body() post: UpdatePostDto,
    @Res() res: Response
  ) {
    const data = await this.postsService.updatePost(post);
    if (!data) {
      const response: ResponseForm = {
        message: "Post not found",
        error: true,
        data,
      };

      return res.status(HttpStatus.BAD_REQUEST).send(response);
    }
    const response: ResponseForm = {
      message: "Update post success",
      error: false,
      data,
    };
    return res.status(HttpStatus.OK).send(response);
  }
}
