import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	BaseEntity,
	JoinColumn, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { Posts } from "./post.entity";

@Entity("media")
export class Media extends BaseEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column()
	mediaType: string;

	@Column()
	url: string;

	@Column()
	extension: string;

	@Column()
	postId: number;

	@CreateDateColumn({name: 'created_at'})
	createdAt: Date;

	@UpdateDateColumn({name: 'updated_at'})
	updatedAt: Date;

	@ManyToOne(() => Posts, (post) => post.media)
	@JoinColumn({ name: "postId", referencedColumnName: "id" })
	post: Posts;
}
