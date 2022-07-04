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

const callEvent = {
  joinRoom: "join-room",
  updateUserList: (room: string) => `${room}-update-user-list`,
  addUser: (room: string) => `${room}-add-user`,
  callUser: "call-user",
  callMade: "call-made",
  makeAnswer: "make-answer",
  answerMade: "answer-made",
  rejectCall: "reject-call",
  callRejected: "call-rejected",
  removeUser: (room: string) => `${room}-remove-user`,
};

@WebSocketGateway({ namespace: "meet", cors: { origin: config.feOrigin } })
export class MeetGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(MeetGateway.name);

  @WebSocketServer()
  server: Server;
  private activeSockets: { room: string; id: string }[] = [];

  @SubscribeMessage(callEvent.joinRoom)
  public joinRoom(client: Socket, room: string) {
    const existingSocket = this.activeSockets.find((s) => s.id === client.id);

    if (!existingSocket) {
      this.activeSockets = [...this.activeSockets, { room, id: client.id }];
      client.emit(callEvent.updateUserList(room), {
        users: this.activeSockets
          .filter((socket) => socket.room === room && socket.id !== client.id)
          .map((existingSocket) => existingSocket.id),
        current: client.id,
      });

      client.broadcast.emit(callEvent.addUser(room), {
        user: client.id,
      });
    }

    return this.logger.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage(callEvent.callUser)
  public callUser(client: Socket, data: any) {
    client.to(data.to).emit(callEvent.callMade, {
      offer: data.offer,
      socket: client.id,
    });
  }

  @SubscribeMessage(callEvent.makeAnswer)
  public makeAnswer(client: Socket, data: any): void {
    client.to(data.to).emit(callEvent.answerMade, {
      socket: client.id,
      answer: data.answer,
    });
  }

  @SubscribeMessage(callEvent.rejectCall)
  public rejectCall(client: Socket, data: any): void {
    client.to(data.from).emit(callEvent.callRejected, {
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
    const existingSocket = this.activeSockets.find((s) => s.id === client.id);
    if (!existingSocket) return;

    this.activeSockets = this.activeSockets.filter((s) => s.id !== client.id);

    client.broadcast.emit(callEvent.removeUser(existingSocket.room), {
      socketId: client.id,
    });
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
