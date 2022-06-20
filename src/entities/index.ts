import { ChatMessageEntity } from './chat-message.entity';
import { ActionCommentEntity } from "./action_comment.entity";
import { ActionPostEntity } from "./action_post.entity";
import { CommentEntity } from "./comment.entity";
import { ContactEntity } from "./contact.entity";
import { MediaEntity } from "./media.entity";
import { PostEntity } from "./post.entity";
import { UserEntity } from "./user.entity";
import { WalletEntity } from "./wallet.entity";
import { ActionEntity } from "./action.entity";
import { ChatGroupEntity } from "./chat-group.entity";
import { ChatGroupCategoryEntity } from "./chat-group-category.entity";

export const entities = [
  UserEntity,
  ContactEntity,
  PostEntity,
  CommentEntity,
  ActionPostEntity,
  ActionCommentEntity,
  WalletEntity,
  MediaEntity,
  ActionEntity,
  ChatGroupEntity,
  ChatGroupCategoryEntity,
  ChatMessageEntity
];
