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

import { ChatGroupCategoryEntity } from "./chat-group-category.entity";
import { ChatMessageEntity } from "./chat-message.entity";

export const chatGroupUserTable = {
  name: "chat-groups_users",
  chatGroupId: "chat-group_id",
  userId: "user_id",
};

@Entity("chat_groups")
export class ChatGroupEntity extends BaseEntity {
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

  @OneToMany(
    () => ChatMessageEntity,
    (messages) => messages.chatGroup,
    {
      cascade: true,
    },
  )
  chatMessage: ChatMessageEntity[];

  @ManyToOne(
    () => ChatGroupCategoryEntity,
    (chatGroupCategory) => chatGroupCategory.chatGroups
  )
  @JoinColumn({ name: "category-id", referencedColumnName: "id" })
  category: ChatGroupCategoryEntity;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: chatGroupUserTable.name,
    joinColumn: {
      name: chatGroupUserTable.chatGroupId,
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: chatGroupUserTable.userId,
      referencedColumnName: "id",
    },
  })
  users: UserEntity[];
}
