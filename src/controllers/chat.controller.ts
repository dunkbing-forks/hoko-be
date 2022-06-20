import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { SendMessageDto, PostChatGroupDto } from "src/dto/chat.dto";
import { ChatService } from "../services/chat.service";
import { BaseController } from "./base-controller";
import { UserReqPayload } from "../dto/user.dto";
import { UserService } from "../services/user.service";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("message")
export class ChatController extends BaseController {
  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {
    super();
  }

  @Post()
  async postMessage(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: SendMessageDto
  ) {
    const user = req.user as UserReqPayload;
    const ownerId = user.id;
    await this.chatService.addMessage(ownerId, data);
    res
      .status(HttpStatus.OK)
      .send(this.toJson({}, { message: "message sent" }));
  }

  @Post("/group")
  async postGroupChat(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: PostChatGroupDto
  ) {
    let group = await this.chatService.checkGroupExist(data.memberIds);

    if (group)
      return res
        .status(HttpStatus.OK)
        .send(this.toJson(group, { message: "chat was created" }));

    const user = req.user as UserReqPayload;
    const ownerId = user.id;
    let displayName = "";

    for (const [index, memberId] of data.memberIds.entries()) {
      const user = await this.userService.getUserById(memberId);
      displayName += `${user.wallets[0].walletAddress}${
        index !== data.memberIds.length - 1 ? ", " : ""
      }`;
    }
    group = await this.chatService.addGroupChat(
      ownerId,
      data.memberIds,
      displayName
    );
    return res
      .status(HttpStatus.OK)
      .send(this.toJson(group, { message: "create chat success" }));
  }
}
