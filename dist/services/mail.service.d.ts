import { MailerService } from "@nestjs-modules/mailer";
import { User } from "../entities/users.entity";
import SMTPTransport from "nodemailer/lib/smtp-transport";
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendGoogleEmail(user: User, password: string): Promise<SMTPTransport.SentMessageInfo>;
    sendGoogleEmailForgot(user: User): Promise<SMTPTransport.SentMessageInfo>;
}
