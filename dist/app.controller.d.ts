import { UserService } from "./services/users.service";
import { MailService } from "./services/mail.service";
import { AuthService } from "./auth/auth.service";
import { Response, Request } from "express";
interface IEmail {
    email: string;
}
export declare class AppController {
    private readonly authService;
    private readonly mailService;
    private readonly userService;
    constructor(authService: AuthService, mailService: MailService, userService: UserService);
    forgotPassword(res: Response, query: IEmail): Promise<void | Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    loginByGoogle(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    refreshJwtToken(req: Request, res: Response): Promise<void>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
    verifyUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export {};
