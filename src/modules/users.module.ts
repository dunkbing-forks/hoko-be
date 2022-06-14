import { WalletEntity } from "../entities/wallet.entity";
import { ContactEntity } from "../entities/contact.entity";
import { Module, MiddlewareConsumer } from "@nestjs/common";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { LoggerMiddleware } from "../common/middlewares/logger.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { config } from "dotenv";

config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ContactEntity, WalletEntity]),
    JwtModule.register({
      secret: process.env.JWT_SIGN_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
