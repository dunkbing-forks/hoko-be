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
import { Comments } from "./comments.entity";

@Entity("actions")
export class ActionsComment extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "id", type: "int" })
  id: number;

  @Column({ name: "user_id", type: "int" })
  userId: number;

  @Column({ name: "comment_id", type: "int" })
  commentId: number;

  @Column({ name: "action", type: "varchar" })
  action: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => Comments, (comment) => comment.actions)
  @JoinColumn({ name: "comment_id", referencedColumnName: "id" })
  comment: Comments;
}
