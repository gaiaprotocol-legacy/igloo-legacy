import { DomNode, el, View, ViewParams } from "common-dapp-module";
import Layout from "../layout/Layout.js";
import LoginRequired from "../user/LoginRequired.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class ChatsView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(this.container = el(".chats-view"));

    this.render();
    this.container.onDelegate(
      SignedUserManager,
      "userFetched",
      () => this.render(),
    );
  }

  private render() {
    this.container.empty().append(el("h1", "Chats"));
    if (!SignedUserManager.signed) {
      this.container.append(new LoginRequired());
    } else {
      //TODO:
      // general
      // me
      // holding
      // following
    }
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
