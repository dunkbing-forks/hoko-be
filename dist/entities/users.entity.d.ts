import { BaseEntity } from "typeorm";
import { ContactInfo } from "./contact.entity";
import { Wallets } from "./wallet.entity";
export declare class User extends BaseEntity {
    id: number;
    username: string;
    password: string;
    role: number;
    active: boolean;
    refreshToken: string;
    refreshTokenExp: Date;
    contactInfo: ContactInfo;
    wallets: Wallets[];
}
