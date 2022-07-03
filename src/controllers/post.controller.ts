import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "../services/post.service";
import { Response, Request } from "express";
import { JwtAuthGuard } from "@common/auth/jwt-auth.guard";
import { BaseController } from "./base-controller";
import { UpdatePostDto, CreatePostDto } from "@dtos/post.dto";
import { UserReqPayload } from "@dtos/user.dto";

@Controller("posts")
export class PostsController extends BaseController {
  constructor(private readonly postsService: PostsService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/current-user")
  async getPostsByUser(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserReqPayload;
    const data = await this.postsService.getPostByUserId(user.id);
    return res.status(HttpStatus.OK).send(this.toJson(data));
  }

  @Get("/")
  async getPosts(@Res() res: Response) {
    const data = await this.postsService.getPosts();
    return res.status(HttpStatus.OK).send(this.toJson(data));
  }

  @UseGuards(JwtAuthGuard)
  @Post("/")
  async createPost(
    @Req() req: Request,
    @Body() post: CreatePostDto,
    @Res() res: Response
  ) {
    const user = req.user as UserReqPayload;
    post.ownerId = user.id;
    const data = await this.postsService.createPost(post);

    return res.status(HttpStatus.OK).send(this.toJson(data));
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updatePost(
    @Param("id") id: number,
    @Body() post: UpdatePostDto,
    @Res() res: Response
  ) {
    const data = await this.postsService.updatePost(id, post);
    if (!data) {
      const response: ResponseForm = {
        message: "Post not found",
        error: true,
        data,
      };

      return res.status(HttpStatus.BAD_REQUEST).send(response);
    }
    return res
      .status(HttpStatus.OK)
      .send(this.toJson(data, { message: "Update post success" }));
  }
}
