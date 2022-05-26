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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const users_service_1 = require("./services/users.service");
const mail_service_1 = require("./services/mail.service");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const auth_service_1 = require("./auth/auth.service");
const common_1 = require("@nestjs/common");
const local_auth_guard_1 = require("./auth/local-auth.guard");
const refresh_token_guard_1 = require("./auth/refresh-token.guard");
const CONSTANT = require("./constant");
let AppController = class AppController {
    constructor(authService, mailService, userService) {
        this.authService = authService;
        this.mailService = mailService;
        this.userService = userService;
    }
    async forgotPassword(res, query) {
        try {
            const dataResponse = await this.userService.forgotPassword(query.email);
            await this.mailService.sendGoogleEmail(dataResponse.user, dataResponse.password);
            return res.redirect("https://ddsgq.xyz/login");
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }
    async login(req, res) {
        try {
            const info = await this.authService.login(req);
            const secretData = {
                jwt_token: info.access_token,
                refresh_token: info.refresh_token,
            };
            return res
                .status(common_1.HttpStatus.ACCEPTED)
                .cookie("token", secretData, {
                sameSite: "strict",
                path: "/",
                maxAge: 1.5 * 60 * 60 * 1000,
                expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
                secure: true,
                httpOnly: true,
            })
                .send(info.account);
        }
        catch (error) {
            console.log("login:\n", error);
        }
    }
    async loginByGoogle(req, res) {
        try {
            const info = await this.authService.loginGoogle(req);
            const secretData = {
                jwt_token: info.access_token,
                refresh_token: info.refresh_token,
            };
            return res
                .status(common_1.HttpStatus.ACCEPTED)
                .cookie("token", secretData, {
                sameSite: "strict",
                path: "/",
                maxAge: 1.5 * 60 * 60 * 1000,
                expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
                secure: true,
                httpOnly: true,
            })
                .send(info.account);
        }
        catch (error) {
            res.send(error.response);
            console.log("loginByGoogle\n", error);
        }
    }
    async refreshJwtToken(req, res) {
        try {
            const token = await this.authService.getJwtToken(req.body.id);
            const refreshToken = await this.authService.getRefreshToken(req.body.id);
            const secretData = {
                jwt_token: token,
                refresh_token: refreshToken,
            };
            res
                .status(common_1.HttpStatus.ACCEPTED)
                .cookie("token", secretData, {
                sameSite: "strict",
                path: "/",
                maxAge: 1.5 * 60 * 60 * 1000,
                expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
                secure: true,
                httpOnly: true,
            })
                .send("refresh token successful");
        }
        catch (error) {
            console.log("refreshJwtToken:\n", error);
        }
    }
    async logout(res) {
        try {
            return res
                .status(common_1.HttpStatus.ACCEPTED)
                .cookie("token", "", {
                sameSite: "strict",
                path: "/",
                httpOnly: true,
            })
                .send("logout");
        }
        catch (error) {
            console.log("logout\n", error);
        }
    }
    async verifyUser(req, res) {
        try {
            const dataResponse = await this.userService.getUserByEmail(req.body.email);
            if (!dataResponse) {
                return res
                    .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .send("email is not correct");
            }
            await this.mailService.sendGoogleEmailForgot(dataResponse);
            return res.status(common_1.HttpStatus.OK).send("send verify to " + req.body.email);
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }
};
__decorate([
    (0, common_1.Get)("/forgot-password"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)("auth/login"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("google-auth/login"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loginByGoogle", null);
__decorate([
    (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
    (0, common_1.Post)("/refresh-token"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "refreshJwtToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("/logout"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)("/verify-user"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "verifyUser", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mail_service_1.MailService,
        users_service_1.UserService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map