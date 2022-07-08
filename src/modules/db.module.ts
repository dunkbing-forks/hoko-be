import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import config from "@common/config";
import { entities } from "@/entities";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const dbConfig = config.database;

export const sqlOptions: PostgresConnectionOptions = {
  type: "postgres",
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.dbName,
  synchronize: true,
  username: dbConfig.dbUser,
  password: dbConfig.dbPassword,
  logging: false,
  entities,
  ssl: config.nodeEnv === "production" && {
    rejectUnauthorized: false,
  },
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...sqlOptions,
      autoLoadEntities: true,
    }),
  ],
})
export class DbModule {}
