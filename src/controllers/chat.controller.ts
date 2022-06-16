import { Controller, Post, Res, Body, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { SendMessageDto } from "src/dto/chat.dto";
import { ChatService } from "../services/chat.service";
import { BaseController } from "./base-controller";

@Controller("message")
export class ChatController extends BaseController {
  constructor(private chatService: ChatService) {
    super();
  }

  @Post()
  postMessage(@Res() res: Response, @Body() data: SendMessageDto) {
    this.chatService.addMessage(data);
    res
      .status(HttpStatus.OK)
      .send(this.toJson({}, { message: "message sent" }));
  }
}
