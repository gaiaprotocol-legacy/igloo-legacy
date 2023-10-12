import { DomNode } from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";
import UserListItem from "./UsetListItem.js";

export default abstract class UserList extends DomNode {
  private contentFetched: boolean = false;

  constructor(tag: string) {
    super(tag + ".user-list");
  }

  protected addUserDetails(userDetails: UserDetails) {
    this.append(new UserListItem(userDetails));
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
