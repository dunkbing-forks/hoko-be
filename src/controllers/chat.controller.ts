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
import { ChatService } from "@services/chat.service";
import { BaseController } from "./base-controller";
import { PostChatGroupDto } from "@dtos/chat.dto";
import { UserReqPayload } from "@dtos/user.dto";
import { UserService } from "@services/user.service";
import { JwtAuthGuard } from "@common/auth/jwt-auth.guard";
import { ChatChannelEntity } from "@entities/chat-channel.entity";

const R = require('ramda');

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
    //
    // data.memberIds.push(ownerId)
    //
    // data.memberIds =  R.uniq(data.memberIds)

    const usernames = await Promise.all(
      data.memberIds.map(async (id) => {
        const user = await this.userService.getUserById(id);
        if (!user) {
          throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
        }
        return user.username;
      })
    );
    console.log("usernames", usernames);
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
