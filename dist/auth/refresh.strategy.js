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
exports.RefreshStrategy = void 0;
const auth_service_1 = require("./auth.service");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let RefreshStrategy = class RefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "refresh") {
    constructor(authService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    const secretData = request === null || request === void 0 ? void 0 : request.cookies["token"];
                    return secretData === null || secretData === void 0 ? void 0 : secretData.jwt_token;
                },
            ]),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: process.env.JWT_SIGN_SECRET,
        });
        this.authService = authService;
    }
    async validate(req, payload) {
        const secretData = req === null || req === void 0 ? void 0 : req.cookies["token"];
        if (!secretData || !(secretData === null || secretData === void 0 ? void 0 : secretData.refresh_token)) {
            throw new common_1.BadRequestException();
        }
        const user = await this.authService.validateRefreshJwtToken(payload.name, secretData.refresh_token);
        if (!user) {
            throw new common_1.BadRequestException();
        }
        return {
            username: user.username,
            sub: user.id,
        };
    }
};
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RefreshStrategy.prototype, "validate", null);
RefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], RefreshStrategy);
exports.RefreshStrategy = RefreshStrategy;
//# sourceMappingURL=refresh.strategy.js.map