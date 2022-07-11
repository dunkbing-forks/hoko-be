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
import { ChatMessageEntity } from "./chat-message.entity";

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    name: "username",
    default: "",
    type: "varchar",
    length: 50,
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    name: "email",
    unique: true,
    nullable: false,
    type: "varchar",
    length: 100,
  })
  email: string;

  @Column({
    name: "phone",
    unique: true,
    nullable: false,
    type: "varchar",
    length: 20,
  })
  phone: string;

  @Column({
    name: "password",
    unique: true,
    nullable: false,
    type: "varchar",
    length: 255,
  })
  password: string;

  @Column({ name: "role", type: "smallint", default: 3 })
  role: number;

  @Column({ name: "active", type: "boolean", default: true })
  active: boolean;

  @Column({ name: "hashed_refresh_token", nullable: true })
  hashedRefreshToken: string;

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

  @OneToMany(() => ChatMessageEntity, (messages) => messages.user, {
    cascade: true,
  })
  chatMessage: ChatMessageEntity[];
}
