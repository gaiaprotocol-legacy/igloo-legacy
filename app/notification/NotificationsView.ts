import { DomNode, el, View, ViewParams } from "common-dapp-module";
import Layout from "../layout/Layout.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class NotificationsView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".notifications-view",
        el("h1", "Notifications"),
      ),
    );

    this.render();
    this.container.onDelegate(
      SignedUserManager,
      "userFetched",
      () => this.render(),
    );
  }

  private render() {
    //TODO:
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
