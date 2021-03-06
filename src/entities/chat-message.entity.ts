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

import { ChatChannelEntity } from "./chat-channel.entity";
import { UserEntity } from "./user.entity";

@Entity("chat_messages")
export class ChatMessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "content", type: "text" })
  content: string;

  @Column({ name: "channel_id", type: "int" })
  channelId: number;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.chatMessage)
  @JoinColumn({ name: "owner_id", referencedColumnName: "id" })
  user: UserEntity;

  @ManyToOne(() => ChatChannelEntity, (chatGroup) => chatGroup.chatMessage)
  @JoinColumn({ name: "channel_id", referencedColumnName: "id" })
  chatGroup: ChatChannelEntity;
}
