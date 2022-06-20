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

import { ChatGroupCategoryEntity } from "./chat-group-category.entity";

@Entity("chat_groups")
export class ChatGroupEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "display-name" })
  displayName: string;

  @Column({ name: "user-ids", type: "json" })
  userIds: number[];

  @Column({ name: "display-image" })
  displayImage: string;

  @Column({ name: "category-id", type: "int" })
  categoryId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => ChatGroupCategoryEntity, (chatGroup) => chatGroup.chatGroups)
  @JoinColumn({ name: "category-id", referencedColumnName: "id" })
  category: ChatGroupCategoryEntity;
}
