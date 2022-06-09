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

import { Posts } from "./post.entity";
import { ActionsComment } from "./actions_comments.entity";

@Entity("comments")
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "title", type: "nvarchar", length: 255 })
  title: string;

  @Column({ name: "description", type: "nvarchar", length: 255 })
  description: string;

  @Column({ name: "active", type: "tinyint", default: 1 })
  active: boolean;

  @Column({ name: "contents", type: "nvarchar", length: 255 })
  contents: string;

  @Column({ name: "post_id", type: "int" })
  postId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => Posts, (post) => post.comments)
  @JoinColumn({ name: "post_id", referencedColumnName: "id" })
  post: Posts;

  @OneToMany(() => ActionsComment, (actions) => actions.comment, {
    cascade: true,
  })
  actions: ActionsComment[];
}
