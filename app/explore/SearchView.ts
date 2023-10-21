import {
    DomNode,
    el,
    MaterialIcon,
    Router,
    View,
    ViewParams,
} from "common-dapp-module";
import Layout from "../layout/Layout.js";

export default class SearchView extends View {
  private container: DomNode;
  private searchInput: DomNode<HTMLInputElement>;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".search-view",
        el("h1", "Search"),
        el(
          "form.search-bar",
          new MaterialIcon("search"),
          this.searchInput = el("input", {
            placeholder: "Search",
            value: new URLSearchParams(location.search).get("q") ?? "",
          }),
          {
            submit: (event) => {
              event.preventDefault();
              Router.go(`/search?q=${this.searchInput.domElement.value}`);
            },
          },
        ),
      ),
    );
    this.fetchSearchResults();
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.fetchSearchResults();
  }

  private async fetchSearchResults(): Promise<void> {
    console.log(new URLSearchParams(location.search).get("q"));
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
