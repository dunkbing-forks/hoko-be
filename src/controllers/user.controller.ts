import {WalletEntity} from "../entities/wallet.entity";
import {Body, Controller, Get, HttpStatus, Param, Post, Put, Res} from "@nestjs/common";
import {UserService} from "../services/user.service";
import {
  ActiveUser,
  ChangePasswordDto,
  CreateUserDto,
  GetInformationDto,
  RoleUser,
  UpdateInformationDto,
  UserResponse,
} from "../dto/user.dto";
import {Response} from "express";
import {BaseController} from "./base-controller";

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

  @Get("/:search")
  async searchUserByName(
    @Res() res: Response,
    @Param("search") username: string
  ): Promise<any> {
    const users = await this.userService.searchUserByName(username);
    return res.status(HttpStatus.OK).send(this.toJson(users));
  }

  @Get("/:id")
  async getUserById(
    @Param("id") id: number,
    @Res() res: Response
  ): Promise<any> {
    console.log("ok");
    const user = await this.userService.getUserById(id);
    return res.status(HttpStatus.OK).send(this.toJson(user));
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
    @Res() res: Response,
  ): Promise<unknown> {
    const user = await this.userService.updateUserActive(data);
    return res.send(this.toJson(user));
  }

  @Put("/update-role")
  async updateRole(
    @Body() request: RoleUser,
    @Res() res: Response,
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
