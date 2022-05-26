"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const googleapis_1 = require("googleapis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let MailService = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendGoogleEmail(user, password) {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
        oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
        try {
            const accessToken = await oauth2Client.getAccessToken();
            const smtpConfig = {
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                service: "email",
                auth: {
                    type: "OAuth2",
                    user: process.env.EMAIL_COMPANY,
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            };
            const transport = nodemailer.createTransport(smtpConfig);
            const mailOptions = {
                from: `Hokolity Team <${process.env.EMAIL_COMPANY}>`,
                to: user.contactInfo.email,
                subject: "Request to reset password",
                html: "",
            };
            const result = await transport.sendMail(mailOptions);
            return result;
        }
        catch (error) {
            console.log("mail.service.ts-sendGoogleEmail", error);
        }
    }
    async sendGoogleEmailForgot(user) {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
        oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
        try {
            const accessToken = await oauth2Client.getAccessToken();
            const smtpConfig = {
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                service: "email",
                auth: {
                    type: "OAuth2",
                    user: process.env.EMAIL_COMPANY,
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            };
            const transport = nodemailer.createTransport(smtpConfig);
            const mailOptions = {
                from: `Hokolity Team <${process.env.EMAIL_COMPANY}>`,
                to: user.contactInfo.email,
                subject: "Request to reset password",
                html: "",
            };
            const result = await transport.sendMail(mailOptions);
            return result;
        }
        catch (error) {
            console.log("mail.service.ts-sendGoogleEmail", error);
        }
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map