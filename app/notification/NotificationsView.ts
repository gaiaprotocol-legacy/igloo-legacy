import { DomNode, el, View, ViewParams } from "common-dapp-module";
import Layout from "../layout/Layout.js";

export default class NotificationsView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".noitifications-view",
        "NotificationsView",
      ),
    );
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
