import { BadRequestException, Injectable, Req } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";

import config from "@common/config";
import { UserReqPayload } from "@dtos/user.dto";
import { AuthService } from "@services/auth.service";

const jwtConfig = config.jwt;

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const secretData = request?.cookies["token"];
          const token = request.headers["refresh-token"];
          const refreshToken = secretData?.jwtToken || token;
          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: jwtConfig.secretOrKey,
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
      id: user.id,
      username: user.username,
      sub: user.id,
    };
  }
}
