import PostList from "./PostList.js";
import PostService from "./PostService.js";

export default class GlobalPostList extends PostList {
  constructor() {
    super(".global-post-list");
  }

  protected async fetchContent() {
    const posts = await PostService.fetchGlobalPosts(this.lastFetchedPostId);
    this.lastFetchedPostId = posts[posts.length - 1].id;
  }
}
