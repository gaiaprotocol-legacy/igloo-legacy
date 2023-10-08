import { DomNode, el, View, ViewParams } from "common-dapp-module";
import Layout from "../Layout.js";

export default class InboxView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".inbox-view",
      ),
    );
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
