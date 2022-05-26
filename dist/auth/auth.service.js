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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const mail_service_1 = require("./../services/mail.service");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../services/users.service");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt_1 = require("@nestjs/jwt");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let AuthService = class AuthService {
    constructor(usersService, jwtService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async validateUser(username, pass) {
        const user = await this.usersService.getUserByName(username);
        const isLogin = user ? await bcrypt.compare(pass, user.password) : false;
        if (user && isLogin) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        return null;
    }
    async login(request) {
        const user = await this.usersService.getUserByName(request.body.username);
        const refreshJwtToken = await this.usersService.updateRefreshToken(user.id);
        if (!user.active)
            throw new common_1.UnauthorizedException();
        return {
            access_token: this.jwtService.sign({
                name: user.username,
                role: user.role,
                sub: user.id,
            }),
            refresh_token: refreshJwtToken,
            account: {
                id: user.id,
                role: user.role,
                username: user.username,
                profile: user.contactInfo,
            },
        };
    }
    async loginGoogle(request) {
        let user = await this.usersService.getUserByName(request.body.email);
        if (!user) {
            const data = await this.usersService.insertUserByLoginGoogle(request.body);
            user = await this.usersService.getUserByName(data.newUser.username);
            const res_email = await this.mailService.sendGoogleEmail(user, data.randomPassword);
            console.log("loginGoogle-email", res_email);
        }
        if (!user.active)
            throw new common_1.UnauthorizedException();
        const refreshJwtToken = await this.usersService.updateRefreshToken(user.id);
        return {
            access_token: this.jwtService.sign({
                name: user.username,
                role: user.role,
                sub: user.id,
            }),
            refresh_token: refreshJwtToken,
            account: {
                id: user.id,
                role: user.role,
                username: user.username,
                profile: user.contactInfo,
            },
        };
    }
    async validateRefreshJwtToken(username, refreshToken) {
        const currentDate = new Date(moment().utc().format("YYYY/MM/DD HH:mm:ss"));
        const user = await this.usersService.getUserWithRefreshToken(username, refreshToken, currentDate);
        return user;
    }
    async getRefreshToken(userId) {
        const refreshToken = await this.usersService.updateRefreshToken(userId);
        return refreshToken;
    }
    async getJwtToken(userId) {
        const user = await this.usersService.getUserById(userId);
        const jwtToken = this.jwtService.signAsync({
            name: user.username,
            role: user.role,
            sub: user.id,
        });
        return jwtToken;
    }
    verifyToken(token) {
        return this.jwtService.verify(token);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UserService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map