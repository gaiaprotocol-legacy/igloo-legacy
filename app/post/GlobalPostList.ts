import { RealtimeChannel } from "@supabase/supabase-js";
import { Store, Supabase } from "common-dapp-module";
import Post from "../database-interface/Post.js";
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
        this.addPost(post);
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
          const cachedPosts = this.store.get<Post[]>("cached-posts") ?? [];
          cachedPosts.push(payload.new);
          this.store.set("cached-posts", cachedPosts, true);
          this.addPost(payload.new);
        },
      )
      .subscribe();
  }

  protected async fetchContent() {
    const posts = (await PostService.fetchGlobalPosts(this.lastFetchedPostId))
      .reverse();
    PostCacher.cachePosts(posts);
    this.lastFetchedPostId = posts[posts.length - 1]?.id;

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-posts", posts, true);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      if (posts.length === 0) {
        this.showEmptyMessage();
      } else {
        for (const post of posts) {
          this.addPost(post);
        }
      }
    }
  }

  public delete() {
    this.channel.unsubscribe();
    super.delete();
  }
}
