import { AuthService } from "../../services/auth.service";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { BadRequestException, Injectable, Req } from "@nestjs/common";
import { config } from "dotenv";
import { UserReqPayload } from "src/dto/user.dto";

config();

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const secretData = request?.cookies["token"];
          const token = request.headers["refresh-token"];
          const refreshToken = secretData?.jwtToken || token;
          console.log(refreshToken);
          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SIGN_SECRET,
    });
  }

  async validate(@Req() req: Request, payload: UserReqPayload) {
    const secretData = req.cookies["token"];
    const refreshToken = secretData?.jwtToken || req.headers["refresh-token"];
    if (!refreshToken) {
      throw new BadRequestException("refresh token is required");
    }
    const user = await this.authService.validateRefreshJwtToken(
      payload.id,
      refreshToken
    );
    if (!user) {
      throw new BadRequestException("Invalid refresh token");
    }
    return {
      username: user.username,
      sub: user.id,
    };
  }
}
