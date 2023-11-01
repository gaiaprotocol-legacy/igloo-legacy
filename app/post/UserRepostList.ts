import { Store } from "common-app-module";
import { Post } from "social-module";
import SignedUserManager from "../user/SignedUserManager.js";
import PostCacher from "./PostCacher.js";
import PostList from "./PostList.js";
import PostService from "./PostService.js";

export default class UserRepostList extends PostList {
  private store: Store;
  private isContentFromCache: boolean = true;
  private lastRepostedAt: string = "-infinity";

  constructor(private userId: string) {
    super(".user-repost-list", "No reposts yet.");
    this.store = new Store(`user-${userId}-repost-list`);

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
  }

  protected async fetchContent() {
    const cachedPosts = this.store.get<Post[]>("cached-posts") ?? [];

    const result = (await PostService.fetchReposts(
      this.userId,
      this.lastRepostedAt,
    )).reverse();
    const posts = result.map((item) => item.post);

    PostCacher.cachePosts(posts);
    this.lastRepostedAt = result[result.length - 1]?.repostedAt ?? "-infinity";

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
}
