import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CommentEntity } from "./comment.entity";

@Entity("actions_comments")
export class ActionCommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "id", type: "int" })
  id: number;

  @Column({ name: "user_id", type: "int" })
  userId: number;

  @Column({ name: "comment_id", type: "int" })
  commentId: number;

  @Column({ name: "action_id", type: "varchar" })
  actionId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => CommentEntity, (comment) => comment.actions)
  @JoinColumn({ name: "comment_id", referencedColumnName: "id" })
  comment: CommentEntity;
}
