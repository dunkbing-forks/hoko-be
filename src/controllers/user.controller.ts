import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { WalletEntity } from "@entities/wallet.entity";
import { UserService } from "@services/user.service";
import {
  ActiveUser,
  ChangePasswordDto,
  CreateUserDto,
  GetInformationDto,
  RoleUser,
  UpdateInformationDto,
  UserResponse,
} from "@dtos/user.dto";
import { BaseController } from "./base-controller";

@Controller("users")
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get("/")
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userService.getAllUsers();
    return this.toJson(users);
  }

  @Get("/search/:username")
  async searchUserByName(
    @Res() res: Response,
    @Param("username") username: string
  ): Promise<any> {
    const users = await this.userService.searchByUsername(username);
    return res.status(HttpStatus.OK).send(this.toJson(users));
  }

  @Get("/:id")
  async getUserById(
    @Param("id") id: number,
    @Res() res: Response
  ): Promise<any> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return res
      .status(HttpStatus.OK)
      .send(this.toJson(this.userService.transform(user)));
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
        wallets: user.wallets.map((wallet: WalletEntity) => {
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
  async updateActive(
    @Body() data: ActiveUser,
    @Res() res: Response
  ): Promise<unknown> {
    const user = await this.userService.updateUserActive(data);
    return res.send(this.toJson(user));
  }

  @Put("/update-role")
  async updateRole(
    @Body() request: RoleUser,
    @Res() res: Response
  ): Promise<unknown> {
    const user = await this.userService.updateUserRole(request);
    return res.send(this.toJson(user));
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
