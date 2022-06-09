import {
  Column,
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Posts } from "./post.entity";

@Entity("actions")
export class ActionsPost extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @PrimaryColumn()
  action: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Posts, (post) => post.comments)
  @JoinColumn({ name: "postId", referencedColumnName: "id" })
  post: Posts;
}
