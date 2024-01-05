import { DomNode, Tabs } from "@common-module/app";
import UserPostList from "./user-posts/UserPostList.js";
import UserRepostList from "./user-posts/UserRepostList.js";
import UserCommentPostList from "./user-posts/UserCommentPostList.js";
import UserLikedPostList from "./user-posts/UserLikedPostList.js";

export default class UserPosts extends DomNode {
  private tabs: Tabs | undefined;
  private userPostList: UserPostList | undefined;
  private userCommentPostList: UserCommentPostList | undefined;
  private userRepostList: UserRepostList | undefined;
  private userLikedPostList: UserLikedPostList | undefined;

  constructor(userId: string | undefined) {
    super(".user-posts");
  }

  public update(userId: string) {
  }
}
