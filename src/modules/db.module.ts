import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AutoEncryptSubscriber } from "typeorm-encrypted";
import { entities } from "../entities";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      synchronize: true,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      logging: false,
      autoLoadEntities: true,
      entities,
      subscribers: [AutoEncryptSubscriber],
    }),
  ],
})
export class DbModule {}
