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

import { ChatGroupEntity } from "./chat-group.entity";

@Entity("chat_message")
export class ChatMessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "content", type: "text" })
  content: string;

  @Column({ name: "group_id", type: "int" })
  chatGroupId: number;

  @Column({ name: "ownerId", type: "int" })
  ownerId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => ChatGroupEntity, (chatGroup) => chatGroup.chatMessage)
  @JoinColumn({ name: "group_id", referencedColumnName: "id" })
  chatGroup: ChatGroupEntity;
}
