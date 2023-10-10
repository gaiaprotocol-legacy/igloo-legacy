import { Store } from "common-dapp-module";
import Post from "../database-interface/Post.js";
import PostCacher from "./PostCacher.js";
import PostList from "./PostList.js";
import PostService from "./PostService.js";

export default class GlobalPostList extends PostList {
  private store: Store = new Store("global-post-list");
  private isContentFromCache: boolean = true;

  constructor() {
    super(".global-post-list");

    const cachedPosts = this.store.get<Post[]>("cached-posts");
    if (cachedPosts) {
      for (const post of cachedPosts) {
        this.addPost(post);
      }
    }
  }

  protected async fetchContent() {
    const posts = await PostService.fetchGlobalPosts(this.lastFetchedPostId);
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
