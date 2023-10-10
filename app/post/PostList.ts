import { DomNode } from "common-dapp-module";
import Post from "../database-interface/Post.js";
import PostListItem from "./PostListItem.js";

export default abstract class PostList extends DomNode {
  private contentFetched: boolean = false;

  protected lastFetchedPostId: number | undefined;

  constructor(tag: string) {
    super(tag + ".post-list");
  }

  protected addPost(post: Post) {
    this.append(new PostListItem(post));
  }

  protected abstract fetchContent(): void;

  public show() {
    this.deleteClass("hidden");
    if (!this.contentFetched) {
      this.fetchContent();
      this.contentFetched = true;
    }
    return this;
  }

  public hide() {
    this.addClass("hidden");
    return this;
  }
}
