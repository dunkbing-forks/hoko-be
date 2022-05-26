import { BaseEntity } from "typeorm";
import { ContactInfo } from "./contact.entity";
export declare class User extends BaseEntity {
    id: number;
    username: string;
    password: string;
    role: number;
    active: boolean;
    refreshToken: string;
    walletAddress: string;
    privateKey?: string;
    refreshTokenExp: Date;
    contactInfo: ContactInfo;
}
