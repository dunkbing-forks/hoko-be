import { MailService } from "./../services/mail.service";
import { UserService } from "../services/users.service";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailService;
    constructor(usersService: UserService, jwtService: JwtService, mailService: MailService);
    validateUser(username: string, pass: string): Promise<any>;
    login(request: Request): Promise<{
        access_token: string;
        refresh_token: string;
        account: {
            id: number;
            role: number;
            username: string;
            profile: import("../entities/contact.entity").ContactInfo;
        };
    }>;
    loginGoogle(request: Request): Promise<{
        access_token: string;
        refresh_token: string;
        account: {
            id: number;
            role: number;
            username: string;
            profile: import("../entities/contact.entity").ContactInfo;
        };
    }>;
    validateRefreshJwtToken(username: string, refreshToken: string): Promise<import("../entities/users.entity").User>;
    getRefreshToken(userId: number): Promise<string>;
    getJwtToken(userId: number): Promise<string>;
    verifyToken(token: string): any;
}
