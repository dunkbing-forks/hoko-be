import { ChatMessageEntity } from "./../entities/chat-message.entity";
import { Injectable } from "@nestjs/common";
import { config } from "dotenv";
import * as Pusher from "pusher";
import { SendMessageDto } from "src/dto/chat.dto";
import { BaseService } from "./base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatGroupEntity } from "../entities/chat-group.entity";

config();

@Injectable()
export class ChatService extends BaseService {
  pusher: Pusher;
  constructor(
    @InjectRepository(ChatGroupEntity)
    private readonly groupChatRepository: Repository<ChatGroupEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly chatMessageRepository: Repository<ChatMessageEntity>
  ) {
    super();
    this.pusher = new Pusher({
      appId: process.env.SOKETI_APP_ID,
      key: process.env.SOKETI_APP_KEY,
      secret: process.env.SOKETI_APP_SECRET,
      host: process.env.SOKETI_HOST,
      port: process.env.SOKETI_PORT,
    });
  }

  async checkGroupExist(memberIds: number[]) {
    try {
      let group = await this.groupChatRepository.findOne({
        where: {
          userIds: `${memberIds}`,
        },
      });

      if (!group) {
        group = await this.groupChatRepository.findOne({
          where: {
            userIds: `${memberIds.reverse()}`,
          },
        });
      }
      return group;
    } catch (e) {
      console.log(e.message);
    }
  }

  async addGroupChat(
    ownerId: number,
    memberIds: number[],
    displayName: string
  ) {
    try {
      // add group chat
      const chatGroupEntity = new ChatGroupEntity();
      chatGroupEntity.userIds = `${memberIds}`;
      chatGroupEntity.ownerId = ownerId;
      chatGroupEntity.displayName = displayName;
      return await chatGroupEntity.save();
    } catch (e) {
      console.log(e.message);
    }
  }

  async addMessage(ownerId: number, data: SendMessageDto) {
    console.log(data);
    try {
      await this.startTransaction();
      const chat = {
        message: data.message,
      };
      await this.pusher.trigger(`chat_${data.channel}`, "message", chat);

      const chatMessageEntity = new ChatMessageEntity();
      chatMessageEntity.content = data.message;
      chatMessageEntity.ownerId = ownerId;
      chatMessageEntity.chatGroupId = data.channel;

      await chatMessageEntity.save();

      await this.commitTransaction();

      return chatMessageEntity;
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    } finally {
      await this.release();
    }
  }
}
