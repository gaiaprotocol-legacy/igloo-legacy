import { msg } from "common-app-module";
import { PostList } from "sofi-module";
import IglooLottieAnimation from "../IglooLottieAnimation.js";
import IglooPost from "../database-interface/IglooPost.js";
import IglooPostInteractions from "../post/IglooPostInteractions.js";
import IglooPostService from "../post/IglooPostService.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class KeyHeldPostList extends PostList<IglooPost> {
  constructor() {
    super(
      ".key-held-post-list",
      IglooPostService,
      {
        storeName: "key-held-posts",
        signedUserId: SignedUserManager.user?.user_id,
        emptyMessage: msg("key-held-post-list-empty-message"),
        wait: true,
      },
      IglooPostInteractions,
      new IglooLottieAnimation(),
    );
  }

  protected fetchPosts(): Promise<
    { posts: IglooPost[]; mainPostId: number }[]
  > {
    throw new Error("Method not implemented.");
  }
}
