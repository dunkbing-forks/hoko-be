import { ChatMessageEntity } from "../entities/chat-message.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { config } from "dotenv";
import * as Pusher from "pusher";
import { SendMessageDto } from "src/dto/chat.dto";
import { BaseService } from "./base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { getConnection, Repository } from "typeorm";
import {
  ChatChannelEntity,
  chatChannelUserTable,
} from "../entities/chat-channel.entity";

config();

@Injectable()
export class ChatService extends BaseService {
  pusher: Pusher;
  constructor(
    @InjectRepository(ChatChannelEntity)
    private readonly channelRepository: Repository<ChatChannelEntity>,
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
      let group = await this.channelRepository.findOne({
        where: {
          userIds: `${memberIds}`,
        },
      });

      if (!group) {
        group = await this.channelRepository.findOne({
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

  async getGroupOfSignalBot(bot_id: number) {
    return await this.channelRepository.findOne({
      ownerId: bot_id,
    });
  }

  async addGroupChat(
    ownerId: number,
    memberIds: number[],
    displayName: string
  ) {
    const chatGroupEntity = new ChatChannelEntity();
    chatGroupEntity.ownerId = ownerId;
    chatGroupEntity.displayName = displayName;
    await chatGroupEntity.save();
    await chatGroupEntity.reload();

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(chatChannelUserTable.name)
      .values(
        memberIds.map((id) => ({
          [chatChannelUserTable.chatChannelId]: chatGroupEntity.id,
          [chatChannelUserTable.userId]: id,
        }))
      )
      .execute();

    return chatGroupEntity;
  }

  async getChannel(channelId: number) {
    return await this.channelRepository.findOne(channelId);
  }

  async addMessage(ownerId: number, data: SendMessageDto) {
    const chatGroup = await this.channelRepository.findOne(data.channel);
    if (!chatGroup) {
      throw new HttpException(
        `Chat group ${data.channel} not found`,
        HttpStatus.NOT_FOUND
      );
    }
    const chatMessageEntity = new ChatMessageEntity();
    chatMessageEntity.content = data.message;
    chatMessageEntity.ownerId = ownerId;
    chatMessageEntity.channelId = data.channel;
    await chatMessageEntity.save();
    const chat = {
      message: data.message,
    };
    await this.pusher.trigger(`chat_${data.channel}`, "message", chat);

    return chatMessageEntity;
  }

  async getAllGroupOfUser(userId: number) {
    return await this.channelRepository
      .createQueryBuilder("groupChat")
      .leftJoinAndSelect("groupChat.users", "users")
      .where("users.id = :userId", { userId: userId })
      .getMany();
  }

  async getChannelMessages(channelId: number, take = 10, page = 0) {
    const skip = take * page;
    const [result, total] = await this.chatMessageRepository.findAndCount({
      where: { channelId },
      take,
      skip,
    });
    return {
      items: result,
      totalPages: Math.ceil(total/10),
      total,
      currentPage: page,
    };
  }
}
