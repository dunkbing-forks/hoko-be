import { BaseEntity } from "typeorm";
import { User } from "./users.entity";
export declare class ContactInfo extends BaseEntity {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    address?: string;
    avatar?: string;
    ownerId: number;
    user: User;
}
