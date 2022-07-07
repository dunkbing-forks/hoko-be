import {
  IsString,
  IsNumber,
  IsBoolean,
  MinLength,
  IsOptional,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(6, { message: "Password is too short" })
  readonly password: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly phone: string;
}

export class GetInformationDto {
  @IsString()
  @MinLength(6, { message: "Username is too short" })
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
  @MinLength(6, { message: "Password is too short" })
  readonly oldPassword: string;

  @IsString()
  @MinLength(6, { message: "Password is too short" })
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

export type UserReqPayload = {
  id: number;
  role?: number;
  username: string;
};

export class UserLoginReq {
  @IsString()
  readonly username: string;
  @IsString()
  readonly password: string;
}

export type UserResponse = {
  id: number;
  username: string;
  role: number;
  active: boolean;
  refreshToken: string;
  contactInfo: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    address: string;
    avatar: string;
    ownerId: number;
  };
  wallets: any[];
};
