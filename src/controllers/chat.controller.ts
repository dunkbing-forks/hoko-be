import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Req,
  UseGuards,
  Get,
  HttpException,
  Param,
} from "@nestjs/common";
import { Request, Response } from "express";
import { SendMessageDto, PostChatGroupDto } from "src/dto/chat.dto";
import { ChatService } from "../services/chat.service";
import { BaseController } from "./base-controller";
import { UserReqPayload } from "../dto/user.dto";
import { UserService } from "../services/user.service";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { ChatChannelEntity } from "../entities/chat-channel.entity";

@Controller("chat")
export class ChatController extends BaseController {
  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Post("/channels")
  async postGroupChat(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: PostChatGroupDto
  ) {
    const user = req.user as UserReqPayload;
    const ownerId = user.id;

    const usernames = await Promise.all(
      data.memberIds.map(async (id) => {
        const user = await this.userService.getUserById(id);
        if (!user) {
          throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
        }
        return user.username;
      })
    );
    const displayName = data.groupName ? data.groupName : usernames.join(", ");

    const group = await this.chatService.addGroupChat(
      ownerId,
      data.memberIds,
      displayName
    );

    return res
      .status(HttpStatus.OK)
      .send(this.toJson(group, { message: "create chat success" }));
  }

  @UseGuards(JwtAuthGuard)
  @Get("/channels")
  async getGroupChatOfOwner(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserReqPayload;
    const ownerId = user.id;
    const data = await this.chatService.getAllGroupOfUser(ownerId);

    data.forEach((item: ChatChannelEntity) => {
      delete item.users;
    });

    return res.status(HttpStatus.OK).send(this.toJson(data, { message: "" }));
  }

  @Post("/bot-signal")
  async signal(@Req() req: Request, @Res() res: Response) {
    const bot = await this.userService.getUserByEmail("botsignal@gmail.com");
    // check bot is existed
    const group = await this.chatService.getGroupOfSignalBot(bot.id);

    await this.chatService.addMessage(bot.id, {
      channel: group.id,
      message: req.body.message,
    });
    return res.status(HttpStatus.OK).send(
      this.toJson({
        message: "ok",
      })
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("/message")
  async sendMessage(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: SendMessageDto
  ) {
    const user = req.user as UserReqPayload;
    const ownerId = user.id;
    const message = await this.chatService.addMessage(ownerId, data);
    return res
      .status(HttpStatus.OK)
      .send(this.toJson(message, { message: "message sent" }));
  }

  @UseGuards(JwtAuthGuard)
  @Get("/channels/:id/messages")
  async getChannelMessages(@Param("id") id: number, @Res() res: Response) {
    const channel = await this.chatService.getChannel(id);
    if (!channel) {
      throw new HttpException(`Channel ${id} not found`, HttpStatus.NOT_FOUND);
    }

    const messages = await this.chatService.getChannelMessages(id);
    return res.status(HttpStatus.OK).send(this.toJson(messages));
  }
}
