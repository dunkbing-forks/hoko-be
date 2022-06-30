
import { MailService } from "./mail.service";
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import * as bcrypt from "bcrypt";
import * as moment from "moment";
import { JwtService } from "@nestjs/jwt";
import { config } from "dotenv";
import { Request } from "express";
import { BaseService } from "./base.service";
import { UserLoginReq } from "src/dto/user.dto";

config();
@Injectable()
export class AuthService extends BaseService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {
    super();
  }

  async validateUser(account: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByPhone(account);
    const isLogin = user ? await bcrypt.compare(pass, user.password) : false;
    if (user && isLogin) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginInfo: UserLoginReq) {
    const user = await this.usersService.getUserByName(loginInfo.username);
    if (!user) throw new NotFoundException("user not found");
    if (!user.active) throw new UnauthorizedException();
    // update refresh token
    const refreshJwtToken = await this.usersService.updateRefreshToken(user.id);

    return {
      accessToken: this.jwtService.sign({
        username: user.username,
        role: user.role,
        id: user.id,
      }, {secret: process.env.JWT_SIGN_SECRET, expiresIn: "1h"}),
      refreshToken: refreshJwtToken,
      account: {
        id: user.id,
        role: user.role,
        username: user.username,
        email: user.email,
        phone: user.phone,
        wallets: user.wallets.map((wallet) => {
          return {
            id: wallet.walletAddress,
          };
        }),
        profile: user.contactInfo,
      },
    };
  }

  // async loginGoogle(request: Request) {
  //   // get user if exist
  //   let user = await this.usersService.getUserByName(request.body.email);
  //   if (!user) {
  //     // if not exist create new user with info of google account
  //     const data = await this.usersService.insertUserByLoginGoogle(
  //       request.body
  //     );
  //     user = await this.usersService.getUserByName(data.newUser.username);
  //     const res_email = await this.mailService.sendGoogleEmail(
  //       user,
  //       data.randomPassword
  //     );
  //     console.log("loginGoogle-email", res_email);
  //   }
  //   // update refresh token
  //
  //   if (!user.active) throw new UnauthorizedException();
  //
  //   const refreshJwtToken = await this.usersService.updateRefreshToken(user.id);
  //   return {
  //     accessToken: this.jwtService.sign({
  //       name: user.username,
  //       role: user.role,
  //       sub: user.id,
  //     }),
  //     refresh_token: refreshJwtToken,
  //     account: {
  //       id: user.id,
  //       role: user.role,
  //       username: user.username,
  //       profile: user.contactInfo,
  //     },
  //   };
  // }

  async validateRefreshJwtToken(user_id: number, refreshToken: string) {
    const user = await this.usersService.getUserById(user_id);
    const matched = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    return matched ? user : null;
  }

  async getRefreshToken(userId: number): Promise<string> {
    const refreshToken = await this.usersService.updateRefreshToken(userId);
    return refreshToken;
  }

  async getJwtToken(userId: number): Promise<string> {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    const jwtToken = this.jwtService.sign({
      username: user.username,
      role: user.role,
      id: user.id,
    }, { secret: process.env.JWT_SIGN_SECRET, expiresIn: "1h" });
    return jwtToken;
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
