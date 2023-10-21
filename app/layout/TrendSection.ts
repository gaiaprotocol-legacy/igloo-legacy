import { DomNode, el, MaterialIcon, Router } from "common-dapp-module";

export default class TrendSection extends DomNode {
  private searchInput: DomNode<HTMLInputElement>;

  constructor() {
    super(".trend-section");
    this.append(
      el(
        "form.search-bar",
        new MaterialIcon("search"),
        this.searchInput = el("input", { placeholder: "Search" }),
        {
          submit: (event) => {
            event.preventDefault();
            Router.go(`/search?q=${this.searchInput.domElement.value}`);
          },
        },
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
