import { DomNode, el, View, ViewParams } from "common-dapp-module";
import Layout from "../layout/Layout.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class SettingsView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".settings-view",
        el("h1", "Settings"),
        el("button", "Log out", {
          click: () => SignedUserManager.signOut(),
        }),
      ),
    );
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
