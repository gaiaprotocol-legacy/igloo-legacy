import {
  DomNode,
  el,
  Router,
  View,
  ViewParams,
} from "@common-module/app";
import Layout from "../layout/Layout.js";
import MaterialIcon from "../MaterialIcon.js";
import SearchResultUserList from "./SearchResultUserList.js";

export default class SearchView extends View {
  private container: DomNode;
  private searchInput: DomNode<HTMLInputElement>;
  private searchResultUserList: SearchResultUserList;

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
        this.searchResultUserList = new SearchResultUserList(),
      ),
    );
    this.fetchSearchResults();
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.fetchSearchResults();
  }

  private async fetchSearchResults(): Promise<void> {
    this.searchResultUserList.searchUsers(
      new URLSearchParams(location.search).get("q")!,
    );
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
