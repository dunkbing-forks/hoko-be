import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

enum ActionType {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
  LOVE = "LOVE",
}

@Entity("actions")
export class ActionEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "id", type: "int" })
  id: number;

  @Column({ name: "icon", type: "nvarchar", length: 255 })
  icon: string;

  @Column({
    name: "type",
    type: "nvarchar",
    length: 255,
    default: ActionType.DISLIKE,
  })
  type: ActionType;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
