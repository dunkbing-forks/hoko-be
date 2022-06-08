import {
	Column,
	Entity,
	OneToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	BaseEntity, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import {Comments} from "./comments.entity";

@Entity("actions")
export class ActionsComment extends BaseEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column()
	userId: number;

	@Column()
	commentId: number;

	@Column()
	action: number;

	@CreateDateColumn({name: 'created_at'})
	createdAt: Date;

	@UpdateDateColumn({name: 'updated_at'})
	updatedAt: Date;

	@ManyToOne(() => Comments, (comment) => comment.actions)
	@JoinColumn({name: "commentId", referencedColumnName: "id"})
	comment: Comments;
}
