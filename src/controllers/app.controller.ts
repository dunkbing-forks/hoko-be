import { UserService } from "../services/user.service";
import { MailService } from "../services/mail.service";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { AuthService } from "../services/auth.service";
import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Res,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { LocalAuthGuard } from "../common/auth/local-auth.guard";
import { Response, Request } from "express";
import { RefreshTokenGuard } from "../common/auth/refresh-token.guard";
import * as CONSTANT from "../common/constants";
import { PostsService } from "../services/post.service";
import { BaseController } from "./base-controller";
import {UserReqPayload} from "../dto/user.dto";

interface IEmail {
  email: string;
}
@Controller()
export class AppController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly postsService: PostsService
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

  // @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const info = await this.authService.login(req);
      return res.status(HttpStatus.ACCEPTED).send(this.toJson(info));
    } catch (error) {
      console.log("login:\n", error);
    }
  }

  // @Post("google-auth/login")
  // async loginByGoogle(@Req() req: Request, @Res() res: Response) {
  //   try {
  //     const info = await this.authService.loginGoogle(req);
  //     const secretData = {
  //       jwtToken: info.accessToken,
  //       refresh_token: info.refresh_token,
  //     };
  //     return res
  //       .status(HttpStatus.ACCEPTED)
  //       .cookie("token", secretData, {
  //         sameSite: "strict",
  //         path: "/",
  //         maxAge: 1.5 * 60 * 60 * 1000,
  //         expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
  //         secure: true,
  //         httpOnly: true,
  //       })
  //       .send(info.account);
  //   } catch (error) {
  //     res.send(error.response);
  //     console.log("loginByGoogle\n", error);
  //   }
  // }

  @UseGuards(RefreshTokenGuard)
  @Post("/refresh-token")
  async refreshJwtToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const token = await this.authService.getJwtToken(req.body.id);
      const refreshToken = await this.authService.getRefreshToken(req.body.id);
      const secretData = {
        jwtToken: token,
        refresh_token: refreshToken,
      };
      res
        .status(HttpStatus.ACCEPTED)
        .cookie("token", secretData, {
          sameSite: "strict",
          path: "/",
          maxAge: 1.5 * 60 * 60 * 1000,
          expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
          secure: true,
          httpOnly: true,
        })
        .send("refresh token successful");
    } catch (error) {
      console.log("refreshJwtToken:\n", error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("/logout")
  async logout(@Res() res: Response) {
    try {
      return res
        .status(HttpStatus.ACCEPTED)
        .cookie("token", "", {
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        })
        .send("logout");
    } catch (error) {
      console.log("logout\n", error);
    }
  }

  @Post("/verify-user")
  async verifyUser(@Req() req: Request, @Res() res: Response) {
    try {
      const dataResponse = await this.userService.getUserByEmail(
        req.body.email
      );
      if (!dataResponse) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send("email is not correct");
      }
      await this.mailService.sendGoogleEmailForgot(dataResponse);
      return res.status(HttpStatus.OK).send("send verify to " + req.body.email);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }
}
