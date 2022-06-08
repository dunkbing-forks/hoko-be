import {
	Column,
	Entity,
	OneToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	BaseEntity, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import {User} from "./users.entity";
import {Comments} from "./comments.entity";
import {ActionsPost} from "./actions_post.entity";
import {Wallets} from "./wallet.entity";
import {Media} from "./media.entity";

export enum Privacy {
	PUBLIC = "PUBLIC",
	PRIVATE = "PRIVATE",
	FRIENDS = "FRIENDS",
	FOLLOWERS = "FOLLOWERS",
}

@Entity("posts")
export class Posts extends BaseEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column()
	title: string;

	@Column()
	contents: string;

	@Column()
	description: string;

	@Column({default: true})
	active: boolean;

	@Column({default: Privacy.PUBLIC})
	privacy: Privacy;

	@CreateDateColumn({name: 'created_at'})
	createdAt: Date;

	@UpdateDateColumn({name: 'updated_at'})
	updatedAt: Date;

	@Column()
	ownerId: number;

	@ManyToOne(() => User, (user) => user.wallets)
	@JoinColumn({name: "ownerId", referencedColumnName: "id"})
	user: User;

	@OneToMany(() => Comments, (comment) => comment.post, {
		cascade: true,
	})
	comments?: Comments[];

	@OneToMany(() => ActionsPost, (actions) => actions.post, {
		cascade: true,
	})
	actions?: ActionsPost[];

	@OneToMany(() => Media, (media) => media.post, {
		cascade: true,
	})
	media: Media[];
}
