import { RealtimeChannel } from "@supabase/supabase-js";
import { Store, Supabase } from "common-dapp-module";
import Post from "../database-interface/Post.js";
import PostCacher from "./PostCacher.js";
import PostList from "./PostList.js";
import PostService from "./PostService.js";

export default class UserPostList extends PostList {
  private store: Store = new Store("user-post-list");
  private isContentFromCache: boolean = true;
  private channel: RealtimeChannel;

  constructor(private userId: string) {
    super(".user-post-list", "No posts from this user yet");

    const cachedPosts = this.store.get<Post[]>(`user-${userId}-cached-posts`);
    if (cachedPosts) {
      for (const post of cachedPosts) {
        this.addPost(post);
      }
    }

    this.channel = Supabase.client
      .channel(`user-${userId}-post-changes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
          filter: "author=eq." + userId,
        },
        (payload: any) => {
          const cachedPosts = this.store.get<Post[]>(`user-${this.userId}-cached-posts`) ?? [];
          cachedPosts.push(payload.new);
          this.store.set(`user-${this.userId}-cached-posts`, cachedPosts, true);
          this.addPost(payload.new);
        },
      )
      .subscribe();
  }

  protected async fetchContent() {
    const posts = (await PostService.fetchUserPosts(
      this.userId,
      this.lastFetchedPostId,
    )).reverse();
    PostCacher.cachePosts(posts);
    this.lastFetchedPostId = posts[posts.length - 1]?.id;

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set(`user-${this.userId}-cached-posts`, posts, true);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      for (const post of posts) {
        this.addPost(post);
      }
    }
  }

  public delete() {
    this.channel.unsubscribe();
    super.delete();
  }
}
