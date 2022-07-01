import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AutoEncryptSubscriber } from "typeorm-encrypted";

import config from "@common/config";
import { entities } from "../entities";

const dbConfig = config.database;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.dbName,
      synchronize: true,
      username: dbConfig.dbUser,
      password: dbConfig.dbPassword,
      logging: false,
      autoLoadEntities: true,
      entities,
      subscribers: [AutoEncryptSubscriber],
    }),
  ],
})
export class DbModule {}
