import { Injectable } from "@nestjs/common";
import { QueryRunner, DataSource } from "typeorm";
import { sqlOptions } from "@modules/db.module";

@Injectable()
export class BaseService {
  protected queryRunner: QueryRunner;
  constructor() {}
  public async startTransaction() {
    // this.queryRunner = getConnection().createQueryRunner();
    const dataSource = new DataSource(sqlOptions);
    await dataSource.initialize();
    this.queryRunner = dataSource.manager.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  public async commitTransaction() {
    await this.queryRunner.commitTransaction();
  }

  public async rollbackTransaction() {
    await this.queryRunner.rollbackTransaction();
  }

  public async release() {
    await this.queryRunner.release();
  }

  protected transform<T>(obj: T) {
    return obj;
  }

  public async saveData(value: any) {
    return await this.queryRunner.manager.save(value);
  }

  public async updateData(target: any, criteria: any, value: any) {
    return await this.queryRunner.manager.update(target, criteria, value);
  }

  public async deleteData(target: any, criteria: any) {
    return await this.queryRunner.manager.delete(target, criteria);
  }
}
