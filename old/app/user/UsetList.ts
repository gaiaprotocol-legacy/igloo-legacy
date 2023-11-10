import { DomNode, el } from "common-app-module";
import UserDetails from "../database-interface/UserDetails.js";
import UserListItem from "./UsetListItem.js";

export default abstract class UserList extends DomNode {
  private contentFetched: boolean = false;
  private emptyMessageDisplay: DomNode | undefined;

  constructor(tag: string, private emptyMessage: string) {
    super(tag + ".user-list");
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

  protected addUserDetails(userDetails: UserDetails) {
    this.emptyMessageDisplay?.delete();
    this.append(new UserListItem(userDetails));
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
  }

  public empty(): this {
    super.empty();
    if (!this.deleted) this.showEmptyMessage();
    return this;
  }
}
