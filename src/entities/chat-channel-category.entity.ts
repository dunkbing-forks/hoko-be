import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { ChatChannelEntity } from "./chat-channel.entity";

@Entity("chat_channel_categories")
export class ChatChannelCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "display-name", type: "varchar", length: 255 })
  displayName: string;

  @Column({ name: "display-image", type: "varchar", length: 255 })
  displayImage: string;

  @OneToMany(() => ChatChannelEntity, (chatGroup) => chatGroup.category)
  chatGroups: ChatChannelEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
