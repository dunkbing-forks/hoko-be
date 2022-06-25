import { ChatMessageEntity } from "../entities/chat-message.entity";
import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { config } from "dotenv";
import * as Pusher from "pusher";
import { SendMessageDto } from "src/dto/chat.dto";
import { BaseService } from "./base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatGroupEntity } from "../entities/chat-group.entity";
import {UserEntity} from "../entities/user.entity";

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

  async getGroupOfSignalBot(bot_id:number) {
    return await this.groupChatRepository.findOne({
      ownerId: bot_id,
    });
  }

  async addGroupChat(
    ownerId: number,
    members: UserEntity[],
    displayName: string,
    slugName: string
  ) {
    try {
      const groups = await this.groupChatRepository.findOne({
        slugName: slugName,
      });

      if (!groups) {
        // add group chat
        const chatGroupEntity = new ChatGroupEntity();
        chatGroupEntity.ownerId = ownerId;
        chatGroupEntity.displayName = displayName;
        chatGroupEntity.slugName = slugName;

        chatGroupEntity.users = members;
        const data = await chatGroupEntity.save();

        return await this.groupChatRepository.findOne(data.id);
      }

      return groups;
    } catch (e) {
      console.log(e.message);
    }
  }

  async addMessage(ownerId: number, data: SendMessageDto) {
    const chatGroup = await this.groupChatRepository.findOne(data.channel);
    if (!chatGroup) {
      throw new HttpException(`Chat group ${data.channel} not found`, HttpStatus.NOT_FOUND);
    }
    const chatMessageEntity = new ChatMessageEntity();
    chatMessageEntity.content = data.message;
    chatMessageEntity.ownerId = ownerId;
    chatMessageEntity.chatGroupId = data.channel;
    await chatMessageEntity.save();
    const chat = {
      message: data.message,
    };
    await this.pusher.trigger(`chat_${data.channel}`, "message", chat);

    return chatMessageEntity;
  }

  async getAllGroupOfUser(userId: number) {
    return await this.groupChatRepository
      .createQueryBuilder("groupChat")
      .leftJoinAndSelect("groupChat.users", "users")
      .where("users.id = :userId", { userId: userId })
      .getMany();
  }
}
