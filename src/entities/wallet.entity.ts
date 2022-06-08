import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { User } from "./users.entity";
@Entity("wallets")
export class Wallets extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  walletAddress: string;

  @Column()
  walletPrivateKey: string;

  @Column({default: true})
  active: boolean;

  @Column()
  ownerId: number;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: "ownerId", referencedColumnName: "id" })
  user: User;
}
