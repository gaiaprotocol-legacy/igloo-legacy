import {
  DomNode,
  el,
  Router,
  Tabs,
  View,
  ViewParams,
} from "@common-module/app";
import Layout from "../layout/Layout.js";
import MaterialIcon from "../MaterialIcon.js";
import ActivityList from "./ActivityList.js";
import NewUserList from "./NewUserList.js";
import TopUserList from "./TopUserList.js";
import TrendingUserList from "./TrendingUserList.js";

export default class ExploreView extends View {
  private container: DomNode;
  private tabs: Tabs;
  private searchInput: DomNode<HTMLInputElement>;
  private trendingUserList: TrendingUserList;
  private topUserList: TopUserList;
  private newUsersList: NewUserList;
  private activityList: ActivityList;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".explore-view",
        el("h1", "Explorer"),
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
        this.tabs = new Tabs("explore", [{
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
        this.trendingUserList = new TrendingUserList(),
        this.topUserList = new TopUserList(),
        this.newUsersList = new NewUserList(),
        this.activityList = new ActivityList(),
      ),
    );

    this.tabs.on("select", (id: string) => {
      [
        this.trendingUserList,
        this.topUserList,
        this.newUsersList,
        this.activityList,
      ]
        .forEach((list) => list.hide());
      if (id === "trending") this.trendingUserList.show();
      else if (id === "top") this.topUserList.show();
      else if (id === "new") this.newUsersList.show();
      else if (id === "activity") this.activityList.show();
    }).init();
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
