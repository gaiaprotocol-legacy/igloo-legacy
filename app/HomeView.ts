import { DomNode, el, View, ViewParams } from "common-dapp-module";
import Layout from "./layout/Layout.js";

export default class HomeView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".home-view",
        "This is the home view.",
      ),
    );
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
