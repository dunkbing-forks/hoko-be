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

import { PostEntity } from "./post.entity";
import { ActionCommentEntity } from "./action_comment.entity";

@Entity("comments")
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "active", type: "smallint", default: 1 })
  active: number;

  @Column({ name: "content", type: "varchar", length: 255 })
  content: string;

  @Column({ name: "post_id", type: "int" })
  postId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({ name: "post_id", referencedColumnName: "id" })
  post: PostEntity;

  @OneToMany(() => ActionCommentEntity, (actions) => actions.comment, {
    cascade: true,
  })
  actions: ActionCommentEntity[];
}
