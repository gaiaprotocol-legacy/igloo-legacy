import { DomNode } from "common-dapp-module";

export default abstract class UserList extends DomNode {
  private contentFetched: boolean = false;

  constructor(tag: string) {
    super(tag + ".user-list");
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
