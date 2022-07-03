import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WalletEntity } from "@entities/wallet.entity";
import { ContactEntity } from "@entities/contact.entity";
import { UserController } from "@controllers/user.controller";
import { UserService } from "@services/user.service";
import { UserEntity } from "@entities/user.entity";
import config from "@common/config";

const jwtConfig = config.jwt;

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ContactEntity, WalletEntity]),
    JwtModule.register({
      secret: jwtConfig.secretOrKey,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
