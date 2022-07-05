import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SendMessageDto } from "@dtos/chat.dto";
import { BaseService } from "./base.service";
import {
  ChatChannelEntity,
  chatChannelUserTable,
} from "@entities/chat-channel.entity";
import { ChatMessageEntity } from "@entities/chat-message.entity";
import config from "@common/config";

@Injectable()
export class ChatService extends BaseService {
  constructor(
    @InjectRepository(ChatChannelEntity)
    private readonly channelRepository: Repository<ChatChannelEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly chatMessageRepository: Repository<ChatMessageEntity>
  ) {
    super();
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
    await this.startTransaction();
    const chatGroupEntity = new ChatChannelEntity();
    chatGroupEntity.ownerId = ownerId;
    chatGroupEntity.displayName = displayName;
    await chatGroupEntity.save();
    await chatGroupEntity.reload();

    await this.queryRunner.connection
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

    await this.commitTransaction();
    return chatGroupEntity;
  }

  async getChannel(channelId: number) {
    return await this.channelRepository.findOneBy({ id: channelId });
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
