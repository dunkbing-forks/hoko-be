"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const users_module_1 = require("./users/users.module");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const auth_module_1 = require("./auth/auth.module");
const dotenv_1 = require("dotenv");
const mail_module_1 = require("./mail/mail.module");
const typeorm_encrypted_1 = require("typeorm-encrypted");
const posts_module_1 = require("./posts/posts.module");
(0, dotenv_1.config)();
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: "mysql",
                host: "localhost",
                port: Number(process.env.DB_PORT),
                database: process.env.DATABASE_NAME,
                synchronize: false,
                username: process.env.USERNAME,
                password: process.env.PASSWORD,
                logging: false,
                autoLoadEntities: true,
                entities: [(0, path_1.join)(__dirname, "**/**.entity{.ts,.js}")],
                cli: {
                    entitiesDir: "src/entities",
                },
                subscribers: [typeorm_encrypted_1.AutoEncryptSubscriber],
            }),
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            posts_module_1.PostsModule,
            users_module_1.UserModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map