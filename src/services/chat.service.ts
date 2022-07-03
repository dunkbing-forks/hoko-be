import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getConnection, Repository } from "typeorm";
import * as Pusher from "pusher";

import { SendMessageDto } from "@dtos/chat.dto";
import { BaseService } from "./base.service";
import {
  ChatChannelEntity,
  chatChannelUserTable,
} from "@entities/chat-channel.entity";
import { ChatMessageEntity } from "@entities/chat-message.entity";
import config from "@common/config";

const soketi = config.soketi;

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
      appId: soketi.appId,
      key: soketi.key,
      secret: soketi.secret,
      host: soketi.host,
      port: soketi.port,
    });
  }

  async getGroupOfSignalBot(bot_id: number) {
    return await this.channelRepository.findOneBy({
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
    return await this.channelRepository.findOneBy({ id: channelId });
  }

  async addMessage(ownerId: number, data: SendMessageDto) {
    const chatGroup = await this.channelRepository.findOneBy({ id: data.channel });
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

    await this.pusher.trigger(
      `chat_${data.channel}`,
      "message",
      chatMessageEntity
    );

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
      order: { createdAt: "DESC" },
      take,
      skip,
    });
    return {
      items: result.reverse(),
      totalPages: Math.ceil(total / 10),
      total,
      currentPage: page,
    };
  }
}
