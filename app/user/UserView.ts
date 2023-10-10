import {
  DomNode,
  el,
  MaterialIcon,
  Tabs,
  View,
  ViewParams,
} from "common-dapp-module";
import Layout from "../layout/Layout.js";
import UserPostList from "../post/UserPostList.js";
import FollowerList from "./FollowerList.js";
import FollowingList from "./FollowingList.js";
import HolderList from "./HolderList.js";
import UserProfileDisplay from "./UserProfileDisplay.js";

export default class UserView extends View {
  private container: DomNode;
  private tabs!: Tabs;
  private xUsername!: string;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".user-view",
      ),
    );

    this.xUsername = params.xUsername!;
    this.render();
  }

  private render() {
    this.container.append(
      el(
        "header",
        el("button", new MaterialIcon("arrow_back"), {
          click: () => history.back(),
        }),
        el("h1", "@" + this.xUsername),
      ),
      el(
        "section.profile",
        new UserProfileDisplay(),
        el(
          ".user-connections",
          this.tabs = new Tabs("user-connections", [{
            id: "holders",
            label: "Holders",
          }, {
            id: "followers",
            label: "Followers",
          }, {
            id: "following",
            label: "Following",
          }]),
          new HolderList(),
          new FollowerList(),
          new FollowingList(),
        ),
      ),
      new UserPostList(),
    );

    this.tabs.init();
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.xUsername = params.xUsername!;
    this.render();
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
