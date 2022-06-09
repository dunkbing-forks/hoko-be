import {
  Column,
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./post.entity";

@Entity("actions")
export class ActionsPost extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "id", type: "int" })
  id: number;

  @Column({ name: "user_id", type: "int" })
  userId: number;

  @Column({ name: "post_id", type: "int" })
  postId: number;

  @Column({ name: "action", type: "varchar" })
  action: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Posts, (post) => post.comments)
  @JoinColumn({ name: "post_id", referencedColumnName: "id" })
  post: Posts;
}
