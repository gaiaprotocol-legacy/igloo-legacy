import { Store } from "common-dapp-module";
import Post from "../database-interface/Post.js";
import PostCacher from "./PostCacher.js";
import PostList from "./PostList.js";
import PostService from "./PostService.js";

export default class FollowingPostList extends PostList {
  private store: Store = new Store("following-post-list");
  private isContentFromCache: boolean = true;

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
    const posts = (await PostService.fetchFollowingPosts(
      this.userId,
      this.lastFetchedPostId,
    )).reverse();
    PostCacher.cachePosts(posts);
    this.lastFetchedPostId = posts[posts.length - 1]?.id;

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-posts", posts, true);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      for (const post of posts) {
        this.addPost(post);
      }
    }
  }
}
