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
import { PostEntity } from "./post.entity";

@Entity("actions_posts")
export class ActionPostEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "id", type: "int" })
  id: number;

  @Column({ name: "user_id", type: "int" })
  userId: number;

  @Column({ name: "post_id", type: "int" })
  postId: number;

  @Column({ name: "action_id", type: "varchar" })
  action_id: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({ name: "post_id", referencedColumnName: "id" })
  post: PostEntity;
}
