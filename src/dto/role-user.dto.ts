import { IsString, IsNumber } from "class-validator";

export class RoleUser {
  @IsNumber()
  readonly roleId: number;

  @IsString()
  readonly roleValue: string;
}
