import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import config from "@common/config";
import { entities } from "@/entities";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

const dbConfig = config.database;

export const mysqlOptions: MysqlConnectionOptions = {
  type: "mysql",
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.dbName,
  synchronize: true,
  username: dbConfig.dbUser,
  password: dbConfig.dbPassword,
  logging: false,
  entities,
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...mysqlOptions,
      autoLoadEntities: true,
    }),
  ],
})
export class DbModule {}
