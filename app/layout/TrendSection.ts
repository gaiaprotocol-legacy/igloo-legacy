import { DomNode, el, MaterialIcon } from "common-dapp-module";

export default class TrendSection extends DomNode {
  constructor() {
    super(".trend-section");
    this.append(
      el(
        "label.search-bar",
        new MaterialIcon("search"),
        el("input", { placeholder: "Search" }),
      ),
      el(".trend-list"),
    );
  }

  public hide() {
    this.addClass("hidden");
  }

  public show() {
    this.deleteClass("hidden");
  }
}
