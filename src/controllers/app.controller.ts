import { UserService } from "../services/user.service";
import { MailService } from "../services/mail.service";
import {
  Controller,
  Get,
  Req,
  Res,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { Response, Request } from "express";
import { PostsService } from "../services/post.service";
import { BaseController } from "./base-controller";

interface IEmail {
  email: string;
}

@Controller()
export class AppController extends BaseController {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly postsService: PostsService,
  ) {
    super();
  }

  @Get("/posts-news-feed")
  async getPostsViral(@Req() req: Request, @Res() res: Response) {
    const data = await this.postsService.getViralPosts();
    console.log(data);
    return res.status(HttpStatus.OK).send(this.toJson(data));
  }

  @Get("/forgot-password")
  async forgotPassword(@Res() res: Response, @Query() query: IEmail) {
    try {
      const dataResponse = await this.userService.forgotPassword(query.email);
      await this.mailService.sendGoogleEmail(
        dataResponse.user,
        dataResponse.password
      );
      return res.redirect("https://ddsgq.xyz/login");
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }
}
