import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("contacts")
export class ContactEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "first_name", type: "nvarchar", length: 50, nullable: true })
  firstName: string;

  @Column({ name: "last_name", type: "nvarchar", length: 50, nullable: true })
  lastName: string;

  @Column({ name: "date_of_birth", nullable: true, type: "date" })
  dateOfBirth?: Date;

  @Column({ type: "text", nullable: true })
  address?: string;

  @Column({ name: "avatar", nullable: true, type: "varchar", length: 255 })
  avatar?: string;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.contactInfo, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "owner_id", referencedColumnName: "id" })
  user: UserEntity;
}
