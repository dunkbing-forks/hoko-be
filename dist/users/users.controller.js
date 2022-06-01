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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../services/users.service");
const users_dto_1 = require("../dto/users.dto");
const get_info_dto_1 = require("../dto/get-info.dto");
const update_infomation_dto_1 = require("../dto/update-infomation.dto");
const change_password_dto_1 = require("../dto/change-password.dto");
const active_user_dto_1 = require("../dto/active-user.dto");
const role_user_dto_1 = require("../dto/role-user.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUsers() {
        const data = await this.userService.getAllUsers();
        return data.map((user) => {
            return {
                id: user.id,
                username: user.username,
                role: user.role,
                active: user.active,
                refreshToken: user.refreshToken,
                refreshTokenExp: user.refreshTokenExp,
                contactInfo: {
                    id: user.contactInfo.id,
                    firstName: user.contactInfo.firstName,
                    lastName: user.contactInfo.lastName,
                    email: user.contactInfo.email,
                    phone: user.contactInfo.phone,
                    dateOfBirth: user.contactInfo.dateOfBirth,
                    address: user.contactInfo.address,
                    avatar: user.contactInfo.avatar,
                    ownerId: user.contactInfo.ownerId,
                },
                wallets: user.wallets.map((wallet) => {
                    return {
                        id: wallet.id,
                        walletAddress: wallet.walletAddress,
                        ownerId: wallet.ownerId,
                    };
                }),
            };
        });
    }
    async searchUserByName(res, username) {
        try {
            const data = await this.userService.searchUserByName(username);
            const response = data.map((user) => {
                return {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    active: user.active,
                    refreshToken: user.refreshToken,
                    refreshTokenExp: user.refreshTokenExp,
                    contactInfo: {
                        id: user.contactInfo.id,
                        firstName: user.contactInfo.firstName,
                        lastName: user.contactInfo.lastName,
                        email: user.contactInfo.email,
                        phone: user.contactInfo.phone,
                        dateOfBirth: user.contactInfo.dateOfBirth,
                        address: user.contactInfo.address,
                        avatar: user.contactInfo.avatar,
                        ownerId: user.contactInfo.ownerId,
                    },
                    wallets: user.wallets.map((wallet) => {
                        return {
                            id: wallet.id,
                            walletAddress: wallet.walletAddress,
                            ownerId: wallet.ownerId,
                        };
                    }),
                };
            });
            return res.status(common_1.HttpStatus.OK).send(response);
        }
        catch (error) { }
    }
    async getUserById(id, res) {
        console.log("ok");
        const user = await this.userService.getUserById(id);
        const response = {
            id: user.id,
            username: user.username,
            role: user.role,
            active: user.active,
            refreshToken: user.refreshToken,
            refreshTokenExp: user.refreshTokenExp,
            contactInfo: {
                id: user.contactInfo.id,
                firstName: user.contactInfo.firstName,
                lastName: user.contactInfo.lastName,
                email: user.contactInfo.email,
                phone: user.contactInfo.phone,
                dateOfBirth: user.contactInfo.dateOfBirth,
                address: user.contactInfo.address,
                avatar: user.contactInfo.avatar,
                ownerId: user.contactInfo.ownerId,
            },
            wallets: user.wallets.map((wallet) => {
                return {
                    id: wallet.id,
                    walletAddress: wallet.walletAddress,
                    ownerId: wallet.ownerId,
                };
            }),
        };
        return res.status(common_1.HttpStatus.OK).send(response);
    }
    async createUser(user, res) {
        try {
            const newUser = await this.userService.insertUser(user);
            return res.status(common_1.HttpStatus.OK).send(newUser);
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send(error.message);
        }
    }
    async getInformation(body) {
        try {
            const user = await this.userService.getUserByName(body.username);
            return Object.assign(Object.assign({}, user.contactInfo), { wallets: user.wallets.map((wallet) => {
                    return {
                        id: wallet.id,
                        walletAddress: wallet.walletAddress,
                        ownerId: wallet.ownerId,
                    };
                }) });
        }
        catch (error) {
            return {
                message: "get information fail...!",
            };
        }
    }
    async updateInformation(request) {
        try {
            return await this.userService.updateUserInformation(request);
        }
        catch (error) {
            return {
                message: "update fail...!",
            };
        }
    }
    async updateActive(request) {
        try {
            const user = await this.userService.updateUserActive(request);
            return user;
        }
        catch (error) {
            return {
                message: "update fail...!",
            };
        }
    }
    async updateRole(request) {
        try {
            const user = await this.userService.updateUserRole(request);
            return user;
        }
        catch (error) {
            return {
                message: "update fail...!",
            };
        }
    }
    async changePassword(data, res) {
        try {
            const change = await this.userService.changePassword(data);
            return res.send(change);
        }
        catch (error) {
            res.send(error);
        }
    }
};
__decorate([
    (0, common_1.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)("/:search/"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUserByName", null);
__decorate([
    (0, common_1.Get)("/:id/"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)("/create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)("/get-information"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_info_dto_1.GetInformationDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getInformation", null);
__decorate([
    (0, common_1.Put)("/update-information"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_infomation_dto_1.UpdateInformationDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateInformation", null);
__decorate([
    (0, common_1.Put)("/update-active"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [active_user_dto_1.ActiveUser]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateActive", null);
__decorate([
    (0, common_1.Put)("/update-role"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_user_dto_1.RoleUser]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Put)("change-password"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_password_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
UserController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=users.controller.js.map