import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as randomToken from "rand-token";
import * as bcrypt from "bcrypt";
import * as moment from "moment";

import * as CONSTANTS from "@common/constants";
import { WalletEntity } from "@entities/wallet.entity";
import { ContactEntity } from "@entities/contact.entity";
import { UserEntity } from "@entities/user.entity";
import { UserResponse } from "@dtos/user.dto";
import { BaseService } from "./base.service";

const Web3 = require("web3");

interface IUser {
  username?: string;
  password: string;
  role?: number;
  active?: boolean;
  firstName?: string;
  lastName?: string;
  address?: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
}

interface GoogleUser {
  email: string;
  familyName: string;
  givenName: string;
  googleId: string;
  imageUrl: string;
  name: string;
}

interface ChangePassword {
  userId: number;
  oldPassword: string;
  newPassword: string;
}

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletsRepository: Repository<WalletEntity>,
    private jwtService: JwtService
  ) {
    super();
  }

  public transform(user: any): any {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      active: user.active,
      contactInfo: {
        id: user.contactInfo.id,
        firstName: user.contactInfo.firstName,
        lastName: user.contactInfo.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.contactInfo.dateOfBirth,
        address: user.contactInfo.address,
        avatar: user.contactInfo.avatar,
        ownerId: user.contactInfo.ownerId,
      },
      wallets: user.wallets?.map((wallet: WalletEntity) => {
        return {
          id: wallet.id,
          walletAddress: wallet.walletAddress,
          ownerId: wallet.ownerId,
        };
      }),
    };
  }

  async getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository
      .createQueryBuilder("users")
      .where("role != 1")
      .leftJoinAndSelect("users.contactInfo", "contacts")
      .leftJoinAndSelect("users.wallets", "wallets")
      .getMany();

    return users.map(this.transform);
  }

  async getUserByName(account: string): Promise<UserEntity> {
    let user = await this.userRepository
      .createQueryBuilder("users")
      .where("email = :email", { email: account })
      .leftJoinAndSelect("users.contactInfo", "contacts")
      .leftJoinAndSelect("users.wallets", "wallets")
      .getOne();
    if (!user) {
      user = await this.userRepository
        .createQueryBuilder("users")
        .where("phone = :phone", { phone: account })
        .leftJoinAndSelect("users.contactInfo", "contacts")
        .leftJoinAndSelect("users.wallets", "wallets")
        .getOne();
    }
    if (!user) {
      user = await this.userRepository
        .createQueryBuilder("users")
        .where("username = :username", { username: account })
        .leftJoinAndSelect("users.contactInfo", "contacts")
        .leftJoinAndSelect("users.wallets", "wallets")
        .getOne();
    }
    return user;
  }

  async searchByUsername(username: string): Promise<UserResponse[]> {
    const users = await this.userRepository
      .createQueryBuilder("users")
      .where("username like :name", { name: `%${username}%` })
      .andWhere("role != 1")
      .leftJoinAndSelect("users.contactInfo", "contacts")
      .getMany();
    if (!users.length) {
      return [];
    }

    return users.map(this.transform);
  }

  async insertUser(user: IUser): Promise<UserEntity> {
    try {
      await this.startTransaction();
      const web3 = new Web3();

      const newUser = await this.queryRunner.manager.save(UserEntity, {
        username: user.username ? user.username : "",
        password: await bcrypt.hash(
          user.password,
          CONSTANTS.ROUND_HASH_PASSWORD.ROUND
        ),
        email: user.email,
        phone: user.phone,
        role: CONSTANTS.ROLE.USER,
        active: user.active,
        refreshToken: randomToken.generate(16),
        refreshTokenExp: moment()
          .utc()
          .add(30, "minute")
          .format("YYYY/MM/DD HH:mm:ss"),
      });
      if (newUser) {
        await this.queryRunner.manager.save(ContactEntity, {
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          dateOfBirth: user.dateOfBirth,
          user: newUser,
        });
        const response = web3.eth.accounts.create();
        await this.queryRunner.manager.save(WalletEntity, {
          walletAddress: response.address,
          walletPrivateKey: response.privateKey,
          user: newUser,
        });
      }
      await this.commitTransaction();

      return newUser;
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    } finally {
      await this.release();
    }
  }

  async changePassword(data: ChangePassword): Promise<any> {
    const user = await this.userRepository.findOne(data.userId);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const isVerifyPassword = user
      ? (await bcrypt.compare(data.oldPassword, user.password)) &&
        !(await bcrypt.compare(data.newPassword, user.password))
      : false;
    if (!isVerifyPassword) {
      throw new HttpException(
        "Password Was Duplicate Or Wrong",
        HttpStatus.BAD_REQUEST
      );
    }

    user.password = await bcrypt.hash(
      data.newPassword,
      CONSTANTS.ROUND_HASH_PASSWORD.ROUND
    );
    await user.save();

    return {
      status: HttpStatus.OK,
      message: "Change Password Successful",
    };
  }

  // async insertUserByLoginGoogle(user: GoogleUser): Promise<any> {
  //   try {
  //     if (await this.contactRepository.findOne({ email: user.email })) {
  //       throw new Error("email already exists...!");
  //     }
  //     const randomPassword = Math.random().toString(36).slice(-8);
  //     const newUser = await this.userRepository
  //       .create({
  //         username: user.email,
  //         password: await bcrypt.hash(
  //           randomPassword,
  //           CONSTANTS.ROUND_HASH_PASSWORD.ROUND
  //         ),
  //         role: CONSTANTS.ROLE.USER,
  //         refreshToken: randomToken.generate(16),
  //         refreshTokenExp: moment()
  //           .utc()
  //           .add(30, "minute")
  //           .format("YYYY/MM/DD HH:mm:ss"),
  //       })
  //       .save();
  //
  //     await this.contactRepository
  //       .create({
  //         firstName: user.givenName,
  //         lastName: user.familyName,
  //         email: user.email,
  //         avatar: user.imageUrl,
  //         user: newUser,
  //       })
  //       .save();
  //
  //     return { newUser, randomPassword };
  //   } catch (error) {
  //     Logger.error(error);
  //     return error;
  //   }
  // }

  async updateRefreshToken(userId: number): Promise<string> {
    const user = await this.userRepository.findOne(userId);
    const refreshToken = this.jwtService.sign(
      {
        username: user.username,
        role: user.role,
        id: user.id,
      },
      { expiresIn: "7 days" }
    );
    user.hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();
    return refreshToken;
  }

  async getUserWithRefreshToken(
    username: string,
    refreshToken: string
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      username,
      hashedRefreshToken: refreshToken,
    });

    if (!user) {
      return null;
    }
    return user;
  }

  async getUserById(userId: number): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder("users")
      .where("`users`.`id` = :id", { id: userId })
      .leftJoinAndSelect("users.contactInfo", "contacts")
      .leftJoinAndSelect("users.wallets", "wallets")
      .getOne();
  }

  async updateUserInformation(req: any): Promise<ContactEntity> {
    const contact = await this.contactRepository.findOne({ ownerId: req.id });
    contact.firstName = req.firstName;
    contact.lastName = req.lastName;
    contact.dateOfBirth = new Date(moment(req.dob, ["DD/MM/YYYY"]).format());
    contact.address = req.address;
    if (req.avatar) {
      contact.avatar = req.avatar;
    }
    return await contact.save();
  }

  async updateUserActive(req: any): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ id: req.id });
    user.active = req.active;
    await user.save();
    return user;
  }

  async updateUserRole(req: any): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ id: req.roleId });
    user.role = req.roleValue;
    await user.save();
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder("users")
      .where("users.email = :email", { email: email })
      .getOne();

    return user;
  }

  async getUserByPhone(phone: string) {
    const user = await this.userRepository
      .createQueryBuilder("users")
      .where("users.phone = :phone", { phone: phone })
      .getOne();
    return user;
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.getUserByEmail(email);
    const randomPassword = Math.random().toString(36).slice(-8);
    user.password = await bcrypt.hash(
      randomPassword,
      CONSTANTS.ROUND_HASH_PASSWORD.ROUND
    );
    await user.save();

    return {
      password: randomPassword,
      user: user,
    };
  }
}
