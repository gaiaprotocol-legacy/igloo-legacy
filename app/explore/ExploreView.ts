import {
  DomNode,
  el,
  MaterialIcon,
  Tabs,
  View,
  ViewParams,
} from "common-dapp-module";
import Layout from "../layout/Layout.js";

export default class ExploreView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".explore-view",
        el("h1", "Explorer"),
        el(
          "label.search-bar",
          new MaterialIcon("search"),
          el("input", { placeholder: "Search" }),
        ),
        new Tabs("explore", [{
          id: "trending",
          label: "Trending",
        }, {
          id: "top",
          label: "Top",
        }, {
          id: "new",
          label: "New",
        }, {
          id: "activity",
          label: "Activity",
        }]),
      ),
    );
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
