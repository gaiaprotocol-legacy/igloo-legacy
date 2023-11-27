import { msg } from "common-app-module";
import { PostList } from "sofi-module";
import IglooLoadingAnimation from "../IglooLoadingAnimation.js";
import IglooPost from "../database-interface/IglooPost.js";
import IglooPostInteractions from "../post/IglooPostInteractions.js";
import IglooPostService from "../post/IglooPostService.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";

export default class KeyHeldPostList extends PostList<IglooPost> {
  constructor() {
    super(
      ".key-held-post-list",
      IglooPostService,
      {
        storeName: "key-held-posts",
        signedUserId: IglooSignedUserManager.user?.user_id,
        emptyMessage: msg("key-held-post-list-empty-message"),
      },
      IglooPostInteractions,
      new IglooLoadingAnimation(),
    );
  }

  protected async fetchPosts(): Promise<{
    fetchedPosts: { posts: IglooPost[]; mainPostId: number }[];
    repostedPostIds: number[];
    likedPostIds: number[];
  }> {
    const userId = IglooSignedUserManager.user?.user_id;
    if (!userId) throw new Error("User ID not found");
    const walletAddress = IglooSignedUserManager.user?.wallet_address;
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
