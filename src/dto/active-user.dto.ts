import { IsBoolean, IsNumber } from "class-validator";

export class ActiveUser {
  @IsNumber()
  readonly id: number;

  @IsBoolean()
  readonly active: boolean;
}
