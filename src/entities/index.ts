import { ChatMessageEntity } from "./chat-message.entity";
import { ActionCommentEntity } from "./action_comment.entity";
import { ActionPostEntity } from "./action_post.entity";
import { CommentEntity } from "./comment.entity";
import { ContactEntity } from "./contact.entity";
import { MediaEntity } from "./media.entity";
import { PostEntity } from "./post.entity";
import { UserEntity } from "./user.entity";
import { WalletEntity } from "./wallet.entity";
import { ActionEntity } from "./action.entity";
import { ChatChannelEntity } from "./chat-channel.entity";
import { ChatChannelCategoryEntity } from "./chat-channel-category.entity";

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
  ChatChannelEntity,
  ChatChannelCategoryEntity,
  ChatMessageEntity,
];
