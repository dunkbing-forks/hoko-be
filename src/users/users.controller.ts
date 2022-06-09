import { Wallets } from "./../entities/wallet.entity";
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Res,
  Param,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { User } from "../entities/users.entity";
import { UserService } from "../services/users.service";
import { CreateUserDto } from "../dto/users.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GetInformationDto } from "../dto/get-info.dto";
import { Response } from "express";
import { UpdateInformationDto } from "../dto/update-infomation.dto";
import * as CONSTANTS from "../constant";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { ActiveUser } from "../dto/active-user.dto";
import { RoleUser } from "../dto/role-user.dto";

type ResponseUser = {
  id: number;
  username: string;
  role: number;
  active: boolean;
  refreshToken: string;
  refreshTokenExp: Date;
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

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  async getAllUsers(): Promise<ResponseUser[]> {
    const data = await this.userService.getAllUsers();
    return data.map((user: User): ResponseUser => {
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        active: user.active,
        refreshToken: user.refreshToken,
        refreshTokenExp: user.refreshTokenExp,
        contactInfo: {
          id: user.contactInfo.id,
          firstName: user.contactInfo.firstName,
          lastName: user.contactInfo.lastName,
          email: user.contactInfo.email,
          phone: user.contactInfo.phone,
          dateOfBirth: user.contactInfo.dateOfBirth,
          address: user.contactInfo.address,
          avatar: user.contactInfo.avatar,
          ownerId: user.contactInfo.ownerId,
        },
        wallets: user.wallets.map((wallet: Wallets) => {
          return {
            id: wallet.id,
            walletAddress: wallet.walletAddress,
            ownerId: wallet.ownerId,
          };
        }),
      };
    });
  }

  @Get("/:search/")
  async searchUserByName(
    @Res() res: Response,
    @Param("search") username: string
  ): Promise<any> {
    try {
      const data = await this.userService.searchUserByName(username);
      const response = data.map((user: User): ResponseUser => {
        return {
          id: user.id,
          username: user.username,
          role: user.role,
          active: user.active,
          refreshToken: user.refreshToken,
          refreshTokenExp: user.refreshTokenExp,
          contactInfo: {
            id: user.contactInfo.id,
            firstName: user.contactInfo.firstName,
            lastName: user.contactInfo.lastName,
            email: user.contactInfo.email,
            phone: user.contactInfo.phone,
            dateOfBirth: user.contactInfo.dateOfBirth,
            address: user.contactInfo.address,
            avatar: user.contactInfo.avatar,
            ownerId: user.contactInfo.ownerId,
          },
          wallets: user.wallets.map((wallet: Wallets) => {
            return {
              id: wallet.id,
              walletAddress: wallet.walletAddress,
              ownerId: wallet.ownerId,
            };
          }),
        };
      });
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send(error.message);
    }
  }

  @Get("/:id/")
  async getUserById(
    @Param("id") id: number,
    @Res() res: Response
  ): Promise<any> {
    console.log("ok");
    const user = await this.userService.getUserById(id);
    const response = {
      id: user.id,
      username: user.username,
      role: user.role,
      active: user.active,
      refreshToken: user.refreshToken,
      refreshTokenExp: user.refreshTokenExp,
      contactInfo: {
        id: user.contactInfo.id,
        firstName: user.contactInfo.firstName,
        lastName: user.contactInfo.lastName,
        email: user.contactInfo.email,
        phone: user.contactInfo.phone,
        dateOfBirth: user.contactInfo.dateOfBirth,
        address: user.contactInfo.address,
        avatar: user.contactInfo.avatar,
        ownerId: user.contactInfo.ownerId,
      },
      wallets: user.wallets.map((wallet: Wallets) => {
        return {
          id: wallet.id,
          walletAddress: wallet.walletAddress,
          ownerId: wallet.ownerId,
        };
      }),
    };
    return res.status(HttpStatus.OK).send(response);
  }

  @Post("/create")
  async createUser(
    @Body() user: CreateUserDto,
    @Res() res: Response
  ): Promise<any> {
    const newUser = await this.userService.insertUser(user);
    return res.status(HttpStatus.OK).send(newUser);
  }

  @Post("/get-information")
  async getInformation(@Body() body: GetInformationDto): Promise<unknown> {
    try {
      const user = await this.userService.getUserByName(body.username);
      return {
        ...user.contactInfo,
        wallets: user.wallets.map((wallet: Wallets) => {
          return {
            id: wallet.id,
            walletAddress: wallet.walletAddress,
            ownerId: wallet.ownerId,
          };
        }),
      };
    } catch (error) {
      return {
        message: "get information fail...!",
      };
    }
  }

  @Put("/update-information")
  async updateInformation(
    @Body() request: UpdateInformationDto
  ): Promise<unknown> {
    try {
      return await this.userService.updateUserInformation(request);
    } catch (error) {
      return {
        message: "update fail...!",
      };
    }
  }

  @Put("/update-active")
  async updateActive(@Body() request: ActiveUser): Promise<unknown> {
    try {
      const user = await this.userService.updateUserActive(request);
      return user;
    } catch (error) {
      return {
        message: "update fail...!",
      };
    }
  }

  @Put("/update-role")
  async updateRole(@Body() request: RoleUser): Promise<unknown> {
    try {
      const user = await this.userService.updateUserRole(request);
      return user;
    } catch (error) {
      return {
        message: "update fail...!",
      };
    }
  }

  @Put("change-password")
  async changePassword(@Body() data: ChangePasswordDto, @Res() res: Response) {
    try {
      const change = await this.userService.changePassword(data);
      return res.send(change);
    } catch (error) {
      res.send(error);
    }
  }
}
