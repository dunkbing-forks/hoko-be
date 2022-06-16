import { IsNotEmpty, IsString } from "class-validator";

export class SendMessageDto {
  @IsString()
  username: string;
  @IsNotEmpty()
  message: string;
}
