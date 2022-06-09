import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./users.entity";
import { Comments } from "./comments.entity";
import { ActionsPost } from "./actions_post.entity";
import { Wallets } from "./wallet.entity";
import { Media } from "./media.entity";

export enum Privacy {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  FRIENDS = "FRIENDS",
  FOLLOWERS = "FOLLOWERS",
}

@Entity("posts")
export class Posts extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "title", type: "nvarchar", length: 255 })
  title: string;

  @Column({ name: "contents", type: "text" })
  contents: string;

  @Column({ name: "description", type: "nvarchar", length: 255 })
  description: string;

  @Column({ name: "active", type: "tinyint", default: 1 })
  active: boolean;

  @Column({ type: "enum", enum: Privacy, default: Privacy.PUBLIC })
  privacy: Privacy;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: "owner_id", referencedColumnName: "id" })
  user: User;

  @OneToMany(() => Comments, (comment) => comment.post, {
    cascade: true,
  })
  comments?: Comments[];

  @OneToMany(() => ActionsPost, (actions) => actions.post, {
    cascade: true,
  })
  actions?: ActionsPost[];

  @OneToMany(() => Media, (media) => media.post, {
    cascade: true,
  })
  media: Media[];
}
