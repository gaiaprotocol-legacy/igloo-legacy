import PostList from "./PostList.js";

export default class UserPostList extends PostList {
  constructor() {
    super(".user-post-list");
  }

  protected fetchContent(): void {
    //TODO:
  }
}
