import { IsString, IsNumber, IsBoolean } from "class-validator";

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsNumber()
  readonly role?: number;

  @IsBoolean()
  readonly active?: boolean;

  @IsString()
  readonly firstName?: string;

  @IsString()
  readonly lastName?: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly phone?: string;

  @IsString()
  readonly address?: string;
}

export class GetInformationDto {
  @IsString()
  readonly username: string;
}

export class ActiveUser {
  @IsNumber()
  readonly id: number;

  @IsBoolean()
  readonly active: boolean;
}

export class ChangePasswordDto {
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly oldPassword: string;

  @IsString()
  readonly newPassword: string;
}

export class RoleUser {
  @IsNumber()
  readonly roleId: number;

  @IsString()
  readonly roleValue: string;
}

export class UpdateInformationDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly firstName?: string;

  @IsString()
  readonly lastName?: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly phone: string;

  @IsString()
  readonly address?: string;

  @IsString()
  readonly dob?: string;

  @IsString()
  readonly avatar?: string;
}
