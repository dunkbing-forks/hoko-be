import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
@Entity("wallets")
export class WalletEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "wallet_address", type: "varchar", length: 255 })
  walletAddress: string;

  @Column({ name: "wallet_private_key", type: "varchar", length: 255 })
  walletPrivateKey: string;

  @Column({ name: "active", type: "tinyint", default: 1 })
  active: boolean;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.wallets)
  @JoinColumn({ name: "owner_id", referencedColumnName: "id" })
  user: UserEntity;
}
