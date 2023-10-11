import {
  DomNode,
  el,
  MaterialIcon,
  Tabs,
  View,
  ViewParams,
} from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";
import Layout from "../layout/Layout.js";
import UserPostList from "../post/UserPostList.js";
import FollowerList from "./FollowerList.js";
import FollowingList from "./FollowingList.js";
import HolderList from "./HolderList.js";
import UserDetailsCacher from "./UserDetailsCacher.js";
import UserProfileDisplay from "./UserProfileDisplay.js";

export default class UserView extends View {
  private container: DomNode;
  private tabs!: Tabs;
  private xUsername!: string;
  private userDetails: UserDetails | undefined;

  private holderList!: HolderList;
  private followerList!: FollowerList;
  private followingList!: FollowingList;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".user-view",
      ),
    );

    this.xUsername = params.xUsername!;
    this.userDetails = UserDetailsCacher.getAndRefreshByXUsername(
      this.xUsername,
    );

    this.render();
    this.container.onDelegate(
      UserDetailsCacher,
      "update",
      (updatedDetails: UserDetails) => {
        if (updatedDetails.x_username === this.xUsername) {
          this.userDetails = updatedDetails;
          this.render();
        }
      },
    );
  }

  private render() {
    this.container.empty().append(
      el(
        "header",
        el("button", new MaterialIcon("arrow_back"), {
          click: () => history.back(),
        }),
        el("h1", `${this.userDetails?.display_name}'s Igloo`),
      ),
      el(
        "section.profile",
        this.userDetails ? new UserProfileDisplay(this.userDetails) : undefined,
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
          this.holderList = new HolderList(),
          this.followerList = new FollowerList(),
          this.followingList = new FollowingList(),
        ),
      ),
      this.userDetails
        ? new UserPostList(this.userDetails.user_id).show()
        : undefined,
    );

    this.tabs.on("select", (id: string) => {
      [this.holderList, this.followerList, this.followingList]
        .forEach((list) => list.hide());
      if (id === "holder") {
        this.holderList.show();
      } else if (id === "followers") {
        this.followerList.show();
      } else if (id === "following") {
        this.followingList.show();
      }
    }).init();
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.xUsername = params.xUsername!;
    this.userDetails = UserDetailsCacher.getAndRefreshByXUsername(
      this.xUsername,
    );
    this.render();
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
