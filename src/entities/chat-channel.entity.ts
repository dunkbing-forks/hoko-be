import { UserEntity } from "./user.entity";
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
  ManyToMany,
  JoinTable,
} from "typeorm";

import { ChatChannelCategoryEntity } from "./chat-channel-category.entity";
import { ChatMessageEntity } from "./chat-message.entity";

export const chatChannelUserTable = {
  name: "chat_channels-users",
  chatChannelId: "chat_channel_id",
  userId: "user_id",
};

@Entity("chat_channels")
export class ChatChannelEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "display-name" })
  displayName: string;

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
    () => ChatChannelCategoryEntity,
    (chatGroupCategory) => chatGroupCategory.chatGroups
  )
  @JoinColumn({ name: "category-id", referencedColumnName: "id" })
  category: ChatChannelCategoryEntity;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: chatChannelUserTable.name,
    joinColumn: {
      name: chatChannelUserTable.chatChannelId,
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: chatChannelUserTable.userId,
      referencedColumnName: "id",
    },
  })
  users: UserEntity[];
}
