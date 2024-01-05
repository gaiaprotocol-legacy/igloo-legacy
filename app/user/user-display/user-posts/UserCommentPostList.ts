import { msg } from "@common-module/app";
import { PostList } from "@common-module/social";
import IglooLoadingAnimation from "../../../IglooLoadingAnimation.js";
import IglooPost from "../../../database-interface/IglooPost.js";
import IglooPostInteractions from "../../../post/IglooPostInteractions.js";
import IglooPostService from "../../../post/IglooPostService.js";
import IglooSignedUserManager from "../../IglooSignedUserManager.js";

export default class UserCommentPostList extends PostList<IglooPost> {
  constructor(userId: string) {
    super(
      ".user-comment-post-list",
      IglooPostService,
      {
        signedUserId: IglooSignedUserManager.user?.user_id,
        emptyMessage: msg("user-comment-post-list-empty-message"),
      },
      IglooPostInteractions,
      new IglooLoadingAnimation(),
    );
  }

  protected fetchPosts(): Promise<
    {
      fetchedPosts: { posts: IglooPost[]; mainPostId: number }[];
      repostedPostIds: number[];
      likedPostIds: number[];
    }
  > {
    throw new Error("Method not implemented.");
  }
}
