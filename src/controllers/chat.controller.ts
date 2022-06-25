import { ChatGroupEntity } from './../entities/chat-group.entity';
import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Req,
  UseGuards,
  Get,
  Param,
} from "@nestjs/common";
import { Request, Response } from "express";
import { SendMessageDto, PostChatGroupDto } from "src/dto/chat.dto";
import { ChatService } from "../services/chat.service";
import { BaseController } from "./base-controller";
import { UserReqPayload } from "../dto/user.dto";
import { UserService } from "../services/user.service";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";

@Controller("message")
export class ChatController extends BaseController {
  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {
    super();
  }

  @Post("/bot-signal")
  async signal(@Req() req: Request, @Res() res: Response) {
    const bot = await this.userService.getUserByEmail("botsignal@gmail.com");
    // check bot is exist
    const group = await this.chatService.getGroupOfSignalBot(bot.id);

    await this.chatService.addMessage(bot.id, {
      channel: group.id,
      message: req.body.message,
    });
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
    let slug_name = "";

    const listMember = []

    for (const [index, memberId] of data.memberIds.entries()) {
      const user = await this.userService.getUserById(memberId);
      listMember.push(user)
      displayName += `${user.wallets[0].walletAddress}${
        index !== data.memberIds.length - 1 ? ", " : ""
      }`;
      slug_name += `${user.wallets[0].walletAddress}` + "_";
    }
    group = await this.chatService.addGroupChat(
      ownerId,
      listMember,
      displayName,
      slug_name
    );
    return res
      .status(HttpStatus.OK)
      .send(this.toJson(group, { message: "create chat success" }));
  }

  @UseGuards(JwtAuthGuard)
  @Get("/groups")
  async getGroupChatOfOwner(
    @Req() req: Request,
    @Res() res: Response
  ) {
    const user = req.user as UserReqPayload;
    const ownerId = user.id;
    const data = await this.chatService.getAllGroupOfUser(ownerId)

    data.forEach((item: ChatGroupEntity) => {
      delete item.users
    })

    return res
      .status(HttpStatus.OK)
      .send(this.toJson(data, { message: "" }));
  }
}
