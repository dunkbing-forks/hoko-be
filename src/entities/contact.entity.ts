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
import { User } from "./users.entity";

@Entity("contacts")
export class ContactInfo extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "first_name", type: "nvarchar", length: 50 })
  firstName: string;

  @Column({ name: "last_name", type: "nvarchar", length: 50 })
  lastName: string;

  @Column({ name: "email", unique: true, type: "nvarchar", length: 100 })
  email: string;

  @Column({ name: "phone", type: "nvarchar", length: 20 })
  phone?: string;

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

  @OneToOne(() => User, (user) => user.contactInfo, { onDelete: "CASCADE" })
  @JoinColumn({ name: "owner_id", referencedColumnName: "id" })
  user: User;
}
