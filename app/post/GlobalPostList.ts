import { RealtimeChannel } from "@supabase/supabase-js";
import { Store, Supabase } from "common-app-module";
import { Post } from "sofi-module";
import SignedUserManager from "../user/SignedUserManager.js";
import PostCacher from "./PostCacher.js";
import PostList from "./PostList.js";
import PostService from "./PostService.js";

export default class GlobalPostList extends PostList {
  private store: Store = new Store("global-post-list");
  private isContentFromCache: boolean = true;
  private channel: RealtimeChannel;

  constructor() {
    super(".global-post-list", "No posts yet");

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
          false,
        );
      }
    }

    this.channel = Supabase.client
      .channel("global-post-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        (payload: any) => {
          if (payload.new.post_ref) return;
          const cachedPosts = this.store.get<Post[]>("cached-posts") ?? [];
          cachedPosts.push(payload.new);
          this.store.set("cached-posts", cachedPosts, true);
          this.addPost(payload.new, false, false, true);
        },
      )
      .subscribe();
  }

  protected async fetchContent() {
    const cachedPosts = this.store.get<Post[]>("cached-posts") ?? [];

    const posts = (await PostService.fetchGlobalPosts(this.lastFetchedPostId))
      .reverse();
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
            cachedPosts.find((p) => p.id === post.id) === undefined,
          );
        }
      }
    }
  }

  public delete() {
    this.channel.unsubscribe();
    super.delete();
  }
}
