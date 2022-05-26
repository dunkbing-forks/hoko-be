import { UserService } from "../services/users.service";
import { CreateUserDto } from "../dto/users.dto";
import { GetInformationDto } from "../dto/get-info.dto";
import { Response } from "express";
import { UpdateInformationDto } from "../dto/update-infomation.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { ActiveUser } from "../dto/active-user.dto";
import { RoleUser } from "../dto/role-user.dto";
declare type ResponseUser = {
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
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<ResponseUser[]>;
    searchUserByName(res: Response, username: string): Promise<any>;
    getUserById(id: number, res: Response): Promise<any>;
    createUser(user: CreateUserDto, res: Response): Promise<any>;
    getInformation(body: GetInformationDto): Promise<Object>;
    updateInformation(request: UpdateInformationDto): Promise<Object>;
    updateActive(request: ActiveUser): Promise<Object>;
    updateRole(request: RoleUser): Promise<Object>;
    changePassword(data: ChangePasswordDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
export {};
