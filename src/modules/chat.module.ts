import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatMessageEntity } from "@entities/chat-message.entity";
import { ChatController } from "@controllers/chat.controller";
import { ChatService } from "@services/chat.service";
import { ChatChannelEntity } from "@entities/chat-channel.entity";
import { UserModule } from "./users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatChannelEntity, ChatMessageEntity]),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
