import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Posts } from "./post.entity";

@Entity("media")
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "media_type", type: "varchar" })
  mediaType: string;

  @Column({ name: "url", type: "varchar" })
  url: string;

  @Column({ name: "extension", type: "varchar", length: 50 })
  extension: string;

  @Column({ name: "post_id", type: "int" })
  postId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => Posts, (post) => post.media)
  @JoinColumn({ name: "post_id", referencedColumnName: "id" })
  post: Posts;
}
