import { msg } from "common-app-module";
import { PostList } from "sofi-module";
import IglooLottieAnimation from "../../../IglooLottieAnimation.js";
import IglooPost from "../../../database-interface/IglooPost.js";
import IglooPostInteractions from "../../../post/IglooPostInteractions.js";
import IglooPostService from "../../../post/IglooPostService.js";
import IglooSignedUserManager from "../../IglooSignedUserManager.js";

export default class UserRepostList extends PostList<IglooPost> {
  constructor(userId: string) {
    super(
      ".user-repost-list",
      IglooPostService,
      {
        signedUserId: IglooSignedUserManager.user?.user_id,
        emptyMessage: msg("user-repost-list-empty-message"),
      },
      IglooPostInteractions,
      new IglooLottieAnimation(),
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
