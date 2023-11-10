import { DomNode, el, Router } from "common-app-module";
import TrendingUserList from "../explore/TrendingUserList.js";
import MaterialIcon from "../MaterialIcon.js";

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
      new TrendingUserList().show(),
    );
  }

  public hide() {
    this.addClass("hidden");
  }

  public show() {
    this.deleteClass("hidden");
  }
}
