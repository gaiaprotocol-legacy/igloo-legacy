import { DomNode, el, Tabs, View, ViewParams } from "common-dapp-module";
import Layout from "./layout/Layout.js";

export default class HomeView extends View {
  private container: DomNode;
  private tabs: Tabs;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".home-view",
        el("h1", "Home"),
        this.tabs = new Tabs("home-view-tabs", [
          { id: "global", label: "Global" },
          { id: "following", label: "Following" },
          { id: "held", label: "Held" },
        ]),
      ),
    );

    this.tabs.init();
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
