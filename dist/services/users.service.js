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
exports.UserService = void 0;
const contact_entity_1 = require("../entities/contact.entity");
const users_entity_1 = require("../entities/users.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const randomToken = require("rand-token");
const moment = require("moment");
const CONSTANTS = require("../constant");
const bcrypt = require("bcrypt");
const Web3 = require("web3");
let UserService = class UserService {
    constructor(userRepository, contactRepository) {
        this.userRepository = userRepository;
        this.contactRepository = contactRepository;
    }
    async getUsers() {
        return this.userRepository.find();
    }
    async getAllUsers() {
        return this.userRepository
            .createQueryBuilder("users")
            .where("role != 1")
            .leftJoinAndSelect("users.contactInfo", "contacts")
            .getMany();
    }
    async getUserByName(username) {
        const user = await this.userRepository
            .createQueryBuilder("users")
            .where("username = :username", { username: username })
            .leftJoinAndSelect("users.contactInfo", "contacts")
            .getOne();
        return user;
    }
    async searchUserByName(username) {
        return this.userRepository
            .createQueryBuilder("users")
            .where("username like :name", { name: `%${username}%` })
            .andWhere("role != 1")
            .leftJoinAndSelect("users.contactInfo", "contacts")
            .getMany();
    }
    async insertUser(user) {
        try {
            if (await this.userRepository.findOne({ username: user.userName })) {
                throw new Error("username already exists...!");
            }
            const web3 = new Web3();
            const response = web3.eth.accounts.create();
            const newUser = await this.userRepository
                .create({
                username: user.userName,
                password: await bcrypt.hash(user.password, CONSTANTS.ROUND_HASH_PASSWORD.ROUND),
                role: CONSTANTS.ROLE.USER,
                active: user.active,
                refreshToken: randomToken.generate(16),
                walletAddress: response.address,
                privateKey: response.privateKey,
                refreshTokenExp: moment()
                    .utc()
                    .add(30, "minute")
                    .format("YYYY/MM/DD HH:mm:ss"),
            })
                .save();
            await this.contactRepository
                .create({
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                dateOfBirth: user.dateOfBirth,
                email: user.email,
                phone: user.phone,
                user: newUser,
            })
                .save();
            return newUser;
        }
        catch (error) {
            common_1.Logger.error(error);
            return error;
        }
    }
    async changePassword(data) {
        const user = await this.getUserById(data.userId);
        const isVerifyPassword = user
            ? (await bcrypt.compare(data.oldPassword, user.password)) &&
                !(await bcrypt.compare(data.newPassword, user.password))
            : false;
        if (isVerifyPassword) {
            user.password = await bcrypt.hash(data.newPassword, CONSTANTS.ROUND_HASH_PASSWORD.ROUND);
            await user.save();
            return {
                status: common_1.HttpStatus.OK,
                message: "Change Password Successful",
            };
        }
        return {
            status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
            message: "Password Was Duplicate Or Wrong",
        };
    }
    async insertUserByLoginGoogle(user) {
        try {
            if (await this.contactRepository.findOne({ email: user.email })) {
                throw new Error("email already exists...!");
            }
            const randomPassword = Math.random().toString(36).slice(-8);
            const newUser = await this.userRepository
                .create({
                username: user.email,
                password: await bcrypt.hash(randomPassword, CONSTANTS.ROUND_HASH_PASSWORD.ROUND),
                role: CONSTANTS.ROLE.USER,
                refreshToken: randomToken.generate(16),
                refreshTokenExp: moment()
                    .utc()
                    .add(30, "minute")
                    .format("YYYY/MM/DD HH:mm:ss"),
            })
                .save();
            await this.contactRepository
                .create({
                firstName: user.givenName,
                lastName: user.familyName,
                email: user.email,
                avatar: user.imageUrl,
                user: newUser,
            })
                .save();
            return { newUser, randomPassword };
        }
        catch (error) {
            common_1.Logger.error(error);
            return error;
        }
    }
    async updateRefreshToken(userId) {
        const user = await this.userRepository.findOne(userId);
        user.refreshToken = randomToken.generate(16);
        user.refreshTokenExp = new Date(moment()
            .utc()
            .add(CONSTANTS.TOKEN_LIFE, "minute")
            .format("YYYY/MM/DD HH:mm:ss"));
        await user.save();
        return user.refreshToken;
    }
    async getUserWithRefreshToken(username, refreshToken, currentDate) {
        const user = await this.userRepository.findOne({
            username: username,
            refreshToken: refreshToken,
            refreshTokenExp: (0, typeorm_2.MoreThanOrEqual)(currentDate),
        });
        if (!user) {
            return null;
        }
        return user;
    }
    async getUserById(userId) {
        const user = this.userRepository.findOne(userId);
        return user;
    }
    async updateUserInformation(req) {
        const contact = await this.contactRepository.findOne({ ownerId: req.id });
        contact.firstName = req.firstName;
        contact.lastName = req.lastName;
        contact.phone = req.phone;
        contact.dateOfBirth = new Date(moment(req.dob, ["DD/MM/YYYY"]).format());
        contact.address = req.address;
        if (req.avatar) {
            contact.avatar = req.avatar;
        }
        contact.save();
        return contact;
    }
    async updateUserActive(req) {
        const user = await this.userRepository.findOne({ id: req.id });
        user.active = req.active;
        user.save();
        return user;
    }
    async updateUserRole(req) {
        const user = await this.userRepository.findOne({ id: req.roleId });
        user.role = req.roleValue;
        user.save();
        return user;
    }
    async getUserByEmail(email) {
        const user = await this.userRepository
            .createQueryBuilder("users")
            .leftJoinAndSelect("users.contactInfo", "contacts")
            .where("contacts.email = :email", { email: email })
            .getOne();
        return user;
    }
    async forgotPassword(email) {
        const user = await this.getUserByEmail(email);
        const randomPassword = Math.random().toString(36).slice(-8);
        user.password = await bcrypt.hash(randomPassword, CONSTANTS.ROUND_HASH_PASSWORD.ROUND);
        await user.save();
        return {
            password: randomPassword,
            user: user,
        };
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(contact_entity_1.ContactInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=users.service.js.map