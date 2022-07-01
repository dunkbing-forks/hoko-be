import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { google } from "googleapis";

import config from "@common/config";
import { UserEntity } from "@entities/user.entity";

const googleEmailConfig = config.googleEmail;

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendGoogleEmail(user: UserEntity) {
    const oauth2Client = new google.auth.OAuth2(
      googleEmailConfig.clientId,
      googleEmailConfig.clientSecret,
      googleEmailConfig.redirectUri
    );
    oauth2Client.setCredentials({
      refresh_token: googleEmailConfig.refreshToken,
    });

    try {
      const accessToken = await oauth2Client.getAccessToken();

      const smtpConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        service: "email",
        auth: {
          type: "OAuth2",
          user: googleEmailConfig.companyEmail,
          clientId: config.googleEmail.clientId,
          clientSecret: config.googleEmail.clientSecret,
          refreshToken: config.googleEmail.refreshToken,
          accessToken: accessToken,
        },
      };

      const transport = nodemailer.createTransport(
        smtpConfig as SMTPTransport.Options
      );

      const mailOptions = {
        from: `Hokolity Team <${googleEmailConfig.companyEmail}>`,
        to: user.email,
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
      googleEmailConfig.clientId,
      googleEmailConfig.clientSecret,
      googleEmailConfig.redirectUri
    );
    oauth2Client.setCredentials({
      refresh_token: googleEmailConfig.refreshToken,
    });

    try {
      const accessToken = await oauth2Client.getAccessToken();

      const smtpConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        service: "email",
        auth: {
          type: "OAuth2",
          user: googleEmailConfig.companyEmail,
          clientId: config.googleEmail.clientId,
          clientSecret: config.googleEmail.clientSecret,
          refreshToken: config.googleEmail.refreshToken,
          accessToken: accessToken,
        },
      };

      const transport = nodemailer.createTransport(
        smtpConfig as SMTPTransport.Options
      );

      const mailOptions = {
        from: `Hokolity Team <${googleEmailConfig.companyEmail}>`,
        to: user.email,
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
