import { DomNode, el } from "common-app-module";
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

  protected showEmptyMessage() {
    this.emptyMessageDisplay?.delete();
    this.emptyMessageDisplay = el("p.empty-message", this.emptyMessage);
    this.emptyMessageDisplay.on(
      "delete",
      () => this.emptyMessageDisplay = undefined,
    );
    this.append(this.emptyMessageDisplay);
  }

  protected addPost(
    post: Post,
    reposted: boolean,
    liked: boolean,
    isNew: boolean,
  ) {
    this.emptyMessageDisplay?.delete();
    new PostListItem(post, reposted, liked, isNew).appendTo(this, 0);
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
    if (!this.deleted) this.showEmptyMessage();
    return this;
  }
}
