import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ContactEntity } from "./contact.entity";
import { WalletEntity } from "./wallet.entity";
import { PostEntity } from "./post.entity";

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "username", unique: true, type: "varchar", length: 50 })
  username: string;

  @Column({ name: "password", type: "varchar", length: 255 })
  password: string;

  @Column({ name: "role", type: "int" })
  role: number;

  @Column({ name: "active", type: "tinyint", default: 1 })
  active: boolean;

  @Column({ nullable: true, name: "refreshtoken" })
  refreshToken: string;

  @Column({ type: "datetime", nullable: true, name: "refreshtokenexp" })
  refreshTokenExp: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @OneToOne(() => ContactEntity, (contactInfo) => contactInfo.user, {
    cascade: true,
  })
  contactInfo: ContactEntity;

  @OneToMany(() => WalletEntity, (wallet) => wallet.user, {
    cascade: true,
  })
  wallets: WalletEntity[];

  @OneToMany(() => PostEntity, (post) => post.user, {
    cascade: true,
  })
  post: PostEntity[];
}
