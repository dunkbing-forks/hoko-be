import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "dotenv";

import { WalletEntity } from "@entities/wallet.entity";
import { ContactEntity } from "@entities/contact.entity";
import { UserController } from "@controllers/user.controller";
import { UserService } from "@services/user.service";
import { UserEntity } from "@entities/user.entity";

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
export class UserModule {}
