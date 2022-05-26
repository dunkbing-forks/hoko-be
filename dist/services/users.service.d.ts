import { ContactInfo } from "../entities/contact.entity";
import { User } from "../entities/users.entity";
import { Repository } from "typeorm";
interface IUser {
    userName: string;
    password: string;
    role?: number;
    active?: boolean;
    firstName?: string;
    lastName?: string;
    address?: string;
    email: string;
    phone?: string;
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
export declare class UserService {
    private readonly userRepository;
    private readonly contactRepository;
    constructor(userRepository: Repository<User>, contactRepository: Repository<ContactInfo>);
    getUsers(): Promise<User[]>;
    getAllUsers(): Promise<User[]>;
    getUserByName(username: string): Promise<User>;
    searchUserByName(username: string): Promise<User[]>;
    insertUser(user: IUser): Promise<User>;
    changePassword(data: ChangePassword): Promise<any>;
    insertUserByLoginGoogle(user: GoogleUser): Promise<any>;
    updateRefreshToken(userId: number): Promise<string>;
    getUserWithRefreshToken(username: string, refreshToken: string, currentDate: Date): Promise<User>;
    getUserById(userId: number): Promise<User>;
    updateUserInformation(req: any): Promise<ContactInfo>;
    updateUserActive(req: any): Promise<User>;
    updateUserRole(req: any): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    forgotPassword(email: string): Promise<any>;
}
export {};
