import { BaseEntity } from "typeorm";
import { ContactInfo } from "./contact.entity";
import { Wallets } from "./wallet.entity";
import { Posts } from "./post.entity";
export declare class User extends BaseEntity {
    id: number;
    username: string;
    password: string;
    role: number;
    active: boolean;
    refreshToken: string;
    refreshTokenExp: Date;
    createdAt: Date;
    updatedAt: Date;
    contactInfo: ContactInfo;
    wallets: Wallets[];
    post: Posts[];
}
