import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { ContactInfo } from "./contact.entity";
import { Wallets } from "./wallet.entity";
import { Posts } from "./post.entity";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: number;

  @Column()
  active: boolean;

  @Column({ nullable: true, name: "refreshtoken" })
  refreshToken: string;

  @Column({ type: "datetime", nullable: true, name: "refreshtokenexp" })
  refreshTokenExp: Date;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.user, {
    cascade: true,
  })
  contactInfo: ContactInfo;

  @OneToMany(() => Wallets, (wallet) => wallet.user, {
    cascade: true,
  })
  wallets: Wallets[];

  @OneToMany(() => Posts, (post) => post.user, {
    cascade: true,
  })
  post: Posts[];
}
