import { Wallets } from './../entities/wallet.entity';
import { AuthModule } from "../auth/auth.module";
import { ContactInfo } from "../entities/contact.entity";
import { Module, MiddlewareConsumer } from "@nestjs/common";
import { UserController } from "./users.controller";
import { UserService } from "../services/users.service";
import { LoggerMiddleware } from "../common/middleware/logger.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, ContactInfo, Wallets])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
