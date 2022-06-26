import { ChatMessageEntity } from "./../entities/chat-message.entity";
import { Module } from "@nestjs/common";
import { ChatController } from "../controllers/chat.controller";
import { ChatService } from "../services/chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGroupEntity } from "../entities/chat-group.entity";
import { UserModule } from "./users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatGroupEntity, ChatMessageEntity]),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
