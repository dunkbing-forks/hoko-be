import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Server } from "ws";
import { Logger } from "@nestjs/common";

import config from "@common/config";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatChannelEntity } from "@entities/chat-channel.entity";
import { Repository } from "typeorm";
import { ChatMessageEntity } from "@entities/chat-message.entity";

const chatEvent = {
  sendMessage: "send-message",
  receiveMessage: "receive-message",
  channelNotFound: "channel-not-found",
};

type SendMessageEventData = {
  channelId: number;
  ownerId: number;
  message: string;
};

@WebSocketGateway({ namespace: "chat", cors: { origin: config.feOrigin } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(ChatGateway.name);
  constructor(
    @InjectRepository(ChatChannelEntity)
    private readonly channelRepository: Repository<ChatChannelEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly chatMessageRepository: Repository<ChatMessageEntity>
  ) {}

  @WebSocketServer()
  server: Server;
  private activeSockets: { channelId: number; socketId: string }[] = [];

  @SubscribeMessage(chatEvent.sendMessage)
  public async sendMessage(client: Socket, data: SendMessageEventData) {
    const existingSocket = this.activeSockets.find(
      (s) => s.socketId === client.id
    );
    if (!existingSocket) {
      this.activeSockets = [
        ...this.activeSockets,
        { socketId: client.id, channelId: data.channelId },
      ];
    }

    const chatGroup = await this.channelRepository.findOneBy({
      id: data.channelId,
    });
    if (!chatGroup) {
      client.emit(chatEvent.channelNotFound, {
        channelId: data.channelId,
      });
    }

    const chatMessageEntity = new ChatMessageEntity();
    chatMessageEntity.content = data.message;
    chatMessageEntity.ownerId = data.ownerId;
    chatMessageEntity.channelId = data.channelId;
    await chatMessageEntity.save();

    client.emit(
      `${chatEvent.receiveMessage}-${data.channelId}`,
      chatMessageEntity
    );
    client.broadcast.emit(
      `${chatEvent.receiveMessage}-${data.channelId}`,
      chatMessageEntity
    );

    return this.logger.log(`Client ${client.id} sent message: ${data.message}`);
  }

  afterInit(server: Server): any {
    this.logger.log(`Server started: ${server.name}`);
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Client connected: ${client.id}, args: ${args}`);
  }

  handleDisconnect(client: Socket): any {
    const existingSocket = this.activeSockets.find(
      (s) => s.socketId === client.id
    );
    if (!existingSocket) return;
    this.activeSockets = this.activeSockets.filter(
      (s) => s.socketId !== client.id
    );
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
