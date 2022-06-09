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

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  contents: string;

  @Column()
  postId: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Posts, (post) => post.comments)
  @JoinColumn({ name: "postId", referencedColumnName: "id" })
  post: Posts;

  @OneToMany(() => ActionsComment, (actions) => actions.comment, {
    cascade: true,
  })
  actions: ActionsComment[];
}
