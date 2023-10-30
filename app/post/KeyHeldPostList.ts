import { RealtimeChannel } from "@supabase/supabase-js";
import { Store, Supabase } from "common-app-module";
import Post from "../database-interface/Post.js";
import SignedUserManager from "../user/SignedUserManager.js";
import PostCacher from "./PostCacher.js";
import PostList from "./PostList.js";
import PostService from "./PostService.js";

export default class KeyHeldPostList extends PostList {
  private store: Store = new Store("key-held-post-list");
  private isContentFromCache: boolean = true;
  private channel: RealtimeChannel | undefined;

  constructor(private walletAddress: string) {
    super(".key-held-post-list", "No posts from users you hold ices for yet");

    const cachedPosts = this.store.get<Post[]>("cached-posts");
    const cachedRepostedPostIds =
      this.store.get<number[]>("cached-reposted-post-ids") ?? [];
    const cachedLikedPostIds =
      this.store.get<number[]>("cached-liked-post-ids") ?? [];

    if (cachedPosts) {
      for (const post of cachedPosts) {
        this.addPost(
          post,
          cachedRepostedPostIds.includes(post.id),
          cachedLikedPostIds.includes(post.id),
        );
      }
    }
  }

  protected async fetchContent() {
    const result = await PostService.fetchKeyHeldPosts(
      this.walletAddress,
      this.lastFetchedPostId,
    );
    const posts = result.posts.reverse();
    PostCacher.cachePosts(posts);
    this.lastFetchedPostId = posts[posts.length - 1]?.id;

    const postIds = posts.map((post) => post.id);

    const repostedPostIds = SignedUserManager.userId
      ? await PostService.checkMultipleRepost(postIds, SignedUserManager.userId)
      : [];

    const likedPostIds = SignedUserManager.userId
      ? await PostService.checkMultipleLike(postIds, SignedUserManager.userId)
      : [];

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-posts", posts, true);
      this.store.set("cached-reposted-post-ids", repostedPostIds, true);
      this.store.set("cached-liked-post-ids", likedPostIds, true);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      if (posts.length === 0) {
        this.showEmptyMessage();
      } else {
        for (const post of posts) {
          this.addPost(
            post,
            repostedPostIds.includes(post.id),
            likedPostIds.includes(post.id),
          );
        }
      }
    }

    this.channel?.unsubscribe();
    this.channel = Supabase.client
      .channel(`key-held-${this.walletAddress}-post-changes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
          filter: "author=in.(" + result.keyOwnerIds.join(",") + ")",
        },
        (payload: any) => {
          const cachedPosts = this.store.get<Post[]>("cached-posts") ?? [];
          cachedPosts.push(payload.new);
          this.store.set("cached-posts", cachedPosts, true);
          this.addPost(payload.new, false, false);
        },
      )
      .subscribe();
  }

  public delete() {
    this.channel?.unsubscribe();
    super.delete();
  }
}
