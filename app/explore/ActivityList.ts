import { DomNode, Store } from "common-dapp-module";

export default class ActivityList extends DomNode {
  private store: Store = new Store("activity-list");

  constructor() {
    super(".activity-list");
  }

  public show() {
    this.deleteClass("hidden");
  }

  public hide() {
    this.addClass("hidden");
  }
}
