import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Res,
  HttpStatus,
  Query,
  Body,
} from "@nestjs/common";
import { Response, Request } from "express";
import { UserService } from "@services/user.service";
import { MailService } from "@services/mail.service";
import { AuthService } from "@services/auth.service";
import { JwtAuthGuard } from "@common/auth/jwt-auth.guard";
import { RefreshTokenGuard } from "@common/auth/refresh-token.guard";
import * as CONSTANT from "@common/constants";
import { UserLoginReq, UserReqPayload } from "@dtos/user.dto";
import { BaseController } from "./base-controller";

interface IEmail {
  email: string;
}

@Controller("auth")
export class AuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userService: UserService
  ) {
    super();
  }

  @Get("/forgot-password")
  async forgotPassword(@Res() res: Response, @Query() query: IEmail) {
    try {
      const dataResponse = await this.userService.forgotPassword(query.email);
      await this.mailService.sendGoogleEmail(dataResponse.user);
      return res.redirect("https://ddsgq.xyz/login");
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Post("/login")
  async login(@Body() loginInfo: UserLoginReq, @Res() res: Response) {
    const info = await this.authService.login(loginInfo);
    return res.status(HttpStatus.ACCEPTED).send(this.toJson(info));
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
    const user = req.user as UserReqPayload;
    const token = await this.authService.getJwtToken(user.id);
    const refreshToken = await this.authService.getRefreshToken(user.id);
    const secretData = {
      jwtToken: token,
      refreshToken,
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
      .send(this.toJson(secretData));
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
