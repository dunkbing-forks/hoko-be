import { Injectable } from "@nestjs/common";
import { config } from "dotenv";
import * as Pusher from "pusher";
import { SendMessageDto } from "src/dto/chat.dto";
import { BaseService } from "./base.service";

config();

@Injectable()
export class ChatService extends BaseService {
  pusher: Pusher;
  constructor() {
    super();
    this.pusher = new Pusher({
      appId: process.env.SOKETI_APP_ID,
      key: process.env.SOKETI_APP_KEY,
      secret: process.env.SOKETI_APP_SECRET,
      host: process.env.SOKETI_HOST,
      port: process.env.SOKETI_PORT,
    });
  }
  addMessage(data: SendMessageDto) {
    const chat = {
      user: data.username,
      message: data.message,
    };
    this.pusher.trigger("chats", "new-message", chat);
  }
}
