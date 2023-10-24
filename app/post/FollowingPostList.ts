import { RealtimeChannel } from "@supabase/supabase-js";
import { Store, Supabase } from "common-dapp-module";
import Post from "../database-interface/Post.js";
import PostCacher from "./PostCacher.js";
import PostList from "./PostList.js";
import PostService from "./PostService.js";

export default class FollowingPostList extends PostList {
  private store: Store = new Store("following-post-list");
  private isContentFromCache: boolean = true;
  private channel: RealtimeChannel | undefined;

  constructor(private userId: string) {
    super(".following-post-list", "No posts from followed users yet");

    const cachedPosts = this.store.get<Post[]>("cached-posts");
    if (cachedPosts) {
      for (const post of cachedPosts) {
        this.addPost(post);
      }
    }
  }

  protected async fetchContent() {
    const result = await PostService.fetchFollowingPosts(
      this.userId,
      this.lastFetchedPostId,
    );
    const posts = result.posts.reverse();
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

    this.channel?.unsubscribe();
    this.channel = Supabase.client
      .channel(`following-${this.userId}-post-changes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
          filter: "author=in.(" + result.followeeIds.join(",") + ")",
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

  public delete() {
    this.channel?.unsubscribe();
    super.delete();
  }
}
