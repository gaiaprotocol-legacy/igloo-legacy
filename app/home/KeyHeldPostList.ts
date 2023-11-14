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

  protected async fetchPosts(): Promise<{
    fetchedPosts: { posts: IglooPost[]; mainPostId: number }[];
    repostedPostIds: number[];
    likedPostIds: number[];
  }> {
    const userId = SignedUserManager.user?.user_id;
    if (!userId) throw new Error("User ID not found");
    const walletAddress = SignedUserManager.user?.wallet_address;
    if (!walletAddress) throw new Error("Wallet address not found");

    const result = await IglooPostService.fetchKeyHeldPosts(
      userId,
      walletAddress,
      this.lastPostId,
    );
    return {
      fetchedPosts: result.posts.map((p) => ({
        posts: [p],
        mainPostId: p.id,
      })),
      repostedPostIds: result.repostedPostIds,
      likedPostIds: result.likedPostIds,
    };
  }
}
