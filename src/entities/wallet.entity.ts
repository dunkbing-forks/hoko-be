import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
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

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: "ownerId", referencedColumnName: "id" })
  user: User;
}
