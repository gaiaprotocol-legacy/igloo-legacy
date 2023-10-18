import { DomNode, el } from "common-dapp-module";
import Post from "../database-interface/Post.js";
import PostListItem from "./PostListItem.js";

export default abstract class PostList extends DomNode {
  private contentFetched: boolean = false;
  private emptyMessageDisplay: DomNode | undefined;

  protected lastFetchedPostId: number | undefined;

  constructor(tag: string, private emptyMessage: string) {
    super(tag + ".post-list");
    this.showEmptyMessage();
  }

  private showEmptyMessage() {
    this.emptyMessageDisplay?.delete();
    this.emptyMessageDisplay = el("p.empty-message", this.emptyMessage);
    this.emptyMessageDisplay.on(
      "delete",
      () => this.emptyMessageDisplay = undefined,
    );
    this.append(this.emptyMessageDisplay);
  }

  protected addPost(post: Post) {
    this.emptyMessageDisplay?.delete();
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

  public empty(): this {
    super.empty();
    this.showEmptyMessage();
    return this;
  }
}
