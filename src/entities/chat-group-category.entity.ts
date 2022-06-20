import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { ChatGroupEntity } from "./chat-group.entity";

@Entity("chat_groups_categories")
export class ChatGroupCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "display-name", type: "varchar", length: 255 })
  displayName: string;

  @Column({ name: "display-image", type: "varchar", length: 255 })
  displayImage: string;

  @OneToMany(() => ChatGroupEntity, (chatGroup) => chatGroup.category)
  chatGroups: ChatGroupEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
