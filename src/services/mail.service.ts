import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { google } from "googleapis";
import { config } from "dotenv";
import { UserEntity } from "../entities/user.entity";
import SMTPTransport from "nodemailer/lib/smtp-transport";

config();

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendGoogleEmail(user: UserEntity, password: string) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    try {
      const accessToken = await oauth2Client.getAccessToken();

      const smtpConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
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

      const transport = nodemailer.createTransport(
        smtpConfig as SMTPTransport.Options
      );

      const mailOptions = {
        from: `Hokolity Team <${process.env.EMAIL_COMPANY}>`,
        to: user.contactInfo.email,
        subject: "Request to reset password",
        html: "",
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.log("mail.service.ts-sendGoogleEmail", error);
    }
  }

  async sendGoogleEmailForgot(user: UserEntity) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    try {
      const accessToken = await oauth2Client.getAccessToken();

      const smtpConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
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

      const transport = nodemailer.createTransport(
        smtpConfig as SMTPTransport.Options
      );

      const mailOptions = {
        from: `Hokolity Team <${process.env.EMAIL_COMPANY}>`,
        to: user.contactInfo.email,
        subject: "Request to reset password",
        html: "",
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.log("mail.service.ts-sendGoogleEmail", error);
    }
  }
}
