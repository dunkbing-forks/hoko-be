import { IsNotEmpty, IsNumber } from "class-validator";

export class SendMessageDto {
  @IsNotEmpty()
  message: string;
  @IsNumber()
  channel: number;
}

export class PostChatGroupDto {
  memberIds: number[];
  groupName: string;
}
