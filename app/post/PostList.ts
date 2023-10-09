import { DomNode } from "common-dapp-module";

export default abstract class PostList extends DomNode {
  private contentFetched: boolean = false;

  protected lastFetchedPostId: number | undefined;

  constructor(tag: string) {
    super(tag + ".post-list");
  }

  protected abstract fetchContent(): void;

  public show() {
    this.deleteClass("hidden");
    if (!this.contentFetched) {
      this.fetchContent();
      this.contentFetched = true;
    }
  }

  public hide() {
    this.addClass("hidden");
  }
}
