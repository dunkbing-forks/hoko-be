import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "@common/auth/jwt.strategy";
import { LocalStrategy } from "@common/auth/local.strategy";
import { RefreshStrategy } from "@common/auth/refresh.strategy";
import { AuthService } from "@services/auth.service";
import { UserModule } from "./users.module";
import { MailModule } from "./mail.module";
import { AuthController } from "@controllers/auth.controller";
import config from "@common/config";

const jwtConfig = config.jwt;
@Module({
  imports: [
    UserModule,
    PassportModule,
    MailModule,
    JwtModule.register({
      secret: jwtConfig.secretOrKey,
      signOptions: { expiresIn: "5400s" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
