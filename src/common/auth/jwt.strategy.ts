import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { config } from "dotenv";
import { UserReqPayload } from "../../dto/user.dto";

config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SIGN_SECRET,
    });
  }

  validate(payload: any): UserReqPayload {
    return {
      username: payload.username,
      id: payload.id,
    };
  }
}
