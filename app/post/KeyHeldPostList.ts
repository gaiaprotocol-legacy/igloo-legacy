import PostList from "./PostList.js";

export default class KeyHeldPostList extends PostList {
  constructor() {
    super(".key-held-post-list", "No posts from users you hold keys for yet");
  }

  protected fetchContent(): void {
    //TODO:
  }
}
