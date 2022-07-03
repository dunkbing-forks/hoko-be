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

@WebSocketGateway({ namespace: "chat", cors: { origin: config.feOrigin } })
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(MessageGateway.name);

  @WebSocketServer()
  server: Server;
  private activeSockets: { room: string, id: string }[] = [];
  
  @SubscribeMessage("join-room")
  public joinRoom(client: Socket, room: string) {
    const existingSocket = this.activeSockets.find(s => s.id === client.id);
    
    if (!existingSocket) {
      this.activeSockets = [...this.activeSockets, { room, id: client.id }];
      client.emit(`${room}-update-user-list`, {
        users: this.activeSockets
          .filter((socket) => socket.room === room && socket.id !== client.id)
          .map((existingSocket) => existingSocket.id),
        current: client.id,
      });

      client.broadcast.emit(`${room}-add-user`, {
        user: client.id,
      });
    }
    
    return this.logger.log(`Client ${client.id} joined room: ${room}`);
  }
  
  @SubscribeMessage("call-user")
  public callUser(client: Socket, data: any) {
    client.to(data.to).emit("call-made", {
      offer: data.offer,
      socket: client.id,
    });
  }

  @SubscribeMessage("make-answer")
  public makeAnswer(client: Socket, data: any): void {
    client.to(data.to).emit("answer-made", {
      socket: client.id,
      answer: data.answer,
    });
  }

  @SubscribeMessage("reject-call")
  public rejectCall(client: Socket, data: any): void {
    client.to(data.from).emit("call-rejected", {
      socket: client.id,
    });
  }

  afterInit(server: Server): any {
    this.logger.log(`Server started: ${server.name}`);
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Client connected: ${client.id}, args: ${args}`);
  }

  handleDisconnect(client: Socket): any {
    const existingSockets = this.activeSockets.find(s => s.id === client.id);
    if (!existingSockets) return;

    this.activeSockets = this.activeSockets.filter(s => s.id !== client.id);

    client.broadcast.emit(`${existingSockets.room}-remove-user`, { socketId: client.id });
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
