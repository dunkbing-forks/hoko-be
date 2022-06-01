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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const contact_entity_1 = require("./contact.entity");
const wallet_entity_1 = require("./wallet.entity");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], User.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "refreshtoken" }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true, name: "refreshtokenexp" }),
    __metadata("design:type", Date)
], User.prototype, "refreshTokenExp", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => contact_entity_1.ContactInfo, (contactInfo) => contactInfo.user, {
        cascade: true,
    }),
    __metadata("design:type", contact_entity_1.ContactInfo)
], User.prototype, "contactInfo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wallet_entity_1.Wallets, (wallet) => wallet.user, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "wallets", void 0);
User = __decorate([
    (0, typeorm_1.Entity)("users")
], User);
exports.User = User;
//# sourceMappingURL=users.entity.js.map