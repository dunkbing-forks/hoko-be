import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { ChatGroupCategoryEntity } from "./chat-group-category.entity";
import { ChatMessageEntity } from "./chat-message.entity";

@Entity("chat_groups")
export class ChatGroupEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "display-name" })
  displayName: string;

  @Column({ name: "user-ids", type: "varchar" })
  userIds: string;

  @Column({ name: "display-image", nullable: true })
  displayImage: string;

  @Column({ name: "category-id", type: "int", nullable: true })
  categoryId: number;

  @Column({ name: "ownerId", type: "int" })
  ownerId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => ChatMessageEntity, (messages) => messages.chatGroup, {
    cascade: true,
  })
  chatMessage: ChatMessageEntity[];

  @ManyToOne(
    () => ChatGroupCategoryEntity,
    (chatGroupCategory) => chatGroupCategory.chatGroups
  )
  @JoinColumn({ name: "category-id", referencedColumnName: "id" })
  category: ChatGroupCategoryEntity;
}
