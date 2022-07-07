import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CommentEntity } from "./comment.entity";
import { UserEntity } from "./user.entity";
import { ActionPostEntity } from "./action_post.entity";
import { MediaEntity } from "./media.entity";

export enum Privacy {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  FRIENDS = "FRIENDS",
  FOLLOWERS = "FOLLOWERS",
}

@Entity("posts")
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "content", type: "text" })
  content: string;

  @Column({ name: "active", type: "smallint", default: 1 })
  active: number;

  @Column({ type: "enum", enum: Privacy, default: Privacy.PUBLIC })
  privacy: Privacy;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @ManyToOne(() => UserEntity, (user) => user.wallets)
  @JoinColumn({ name: "owner_id", referencedColumnName: "id" })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    cascade: true,
  })
  comments?: CommentEntity[];

  @OneToMany(() => ActionPostEntity, (actions) => actions.post, {
    cascade: true,
  })
  actions?: ActionPostEntity[];

  @OneToMany(() => MediaEntity, (media) => media.post, {
    cascade: true,
  })
  media: MediaEntity[];
}
