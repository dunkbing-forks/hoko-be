import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import config from "@common/config";
import { UserReqPayload } from "@dtos/user.dto";

const jwtConfig = config.jwt;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secretOrKey,
    });
  }

  validate(payload: any): UserReqPayload {
    return {
      username: payload.username,
      id: payload.id,
    };
  }
}
