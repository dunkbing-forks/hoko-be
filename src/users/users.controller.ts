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
        };
      });
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {}
  }

  @Get("/:id/")
  async getUserById(@Param("id") id: number, @Res() res: Response): Promise<any> {
    const user = await this.userService.getUserById(id)
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
      };
    return res.status(HttpStatus.OK).send(response);
  }

  @Post("/create")
  async createUser(@Body() user: CreateUserDto, @Res() res: Response): Promise<any> {
    try {
      const newUser = await this.userService.insertUser(user);
      const response = {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        active: newUser.active,
        refreshToken: newUser.refreshToken,
        refreshTokenExp: newUser.refreshTokenExp,
        contactInfo: {
          id: newUser.contactInfo.id,
          firstName: newUser.contactInfo.firstName,
          lastName: newUser.contactInfo.lastName,
          email: newUser.contactInfo.email,
          phone: newUser.contactInfo.phone,
          dateOfBirth: newUser.contactInfo.dateOfBirth,
          address: newUser.contactInfo.address,
          avatar: newUser.contactInfo.avatar,
          ownerId: newUser.contactInfo.ownerId,
        },
      };
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      return {
        message: "create user fail...!",
      };
    }
  }

  @Post("/get-information")
  async getInformation(@Body() body: GetInformationDto): Promise<Object> {
    try {
      const contact = await this.userService.getUserByName(body.username);
      return contact.contactInfo;
    } catch (error) {
      return {
        message: "get information fail...!",
      };
    }
  }

  @Put("/update-information")
  async updateInformation(
    @Body() request: UpdateInformationDto
  ): Promise<Object> {
    try {
      const contact = await this.userService.updateUserInformation(request);
      return contact;
    } catch (error) {
      return {
        message: "update fail...!",
      };
    }
  }

  @Put("/update-active")
  async updateActive(@Body() request: ActiveUser): Promise<Object> {
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
  async updateRole(@Body() request: RoleUser): Promise<Object> {
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
