import { JwtStrategy } from "../common/auth/jwt.strategy";
import { Module } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { UserModule } from "./users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "../common/auth/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { config } from "dotenv";
import { RefreshStrategy } from "../common/auth/refresh.strategy";
import { MailModule } from "./mail.module";
import { AuthController } from "../controllers/auth.controller";

config();
@Module({
  imports: [
    UserModule,
    PassportModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SIGN_SECRET,
      signOptions: { expiresIn: "5400s" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}

