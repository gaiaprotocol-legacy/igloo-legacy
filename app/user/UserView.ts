import {
  DomNode,
  el,
  MaterialIcon,
  Tabs,
  View,
  ViewParams,
} from "common-dapp-module";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import UserDetails from "../database-interface/UserDetails.js";
import Layout from "../layout/Layout.js";
import UserPostList from "../post/UserPostList.js";
import SubjectDetailsCacher from "../subject/SubjectDetailsCacher.js";
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
  private subjectDetails: SubjectDetails | undefined;

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
    this.subjectDetails = this.userDetails?.wallet_address
      ? SubjectDetailsCacher.getAndRefresh(
        this.userDetails.wallet_address,
      )
      : undefined;

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
    this.container.onDelegate(
      SubjectDetailsCacher,
      "update",
      (updatedDetails: SubjectDetails) => {
        if (updatedDetails.subject === this.userDetails?.wallet_address) {
          this.subjectDetails = updatedDetails;
          this.render();
        }
      },
    );
  }

  private render() {
    this.container.empty();

    if (!this.userDetails) {
      this.container.append(
        el(
          "header",
          el("button", new MaterialIcon("arrow_back"), {
            click: () => history.back(),
          }),
          el("h1", "User Not Found"),
        ),
      );
    } else {
      this.container.append(
        el(
          "header",
          el("button", new MaterialIcon("arrow_back"), {
            click: () => history.back(),
          }),
          el("h1", `${this.userDetails.display_name}'s Igloo`),
        ),
        el(
          "section.profile",
          new UserProfileDisplay(this.userDetails),
          el(
            ".user-connections",
            this.tabs = new Tabs(
              "user-connections",
              (() => {
                const tabs: { id: string; label: string }[] = [];
                if (this.subjectDetails) {
                  tabs.push({
                    id: "holders",
                    label: this.subjectDetails.key_holder_count + " Holders",
                  });
                }
                tabs.push({
                  id: "followers",
                  label: this.userDetails.follower_count + " Followers",
                });
                tabs.push({
                  id: "following",
                  label: this.userDetails.following_count + " Following",
                });
                return tabs;
              })(),
            ),
            this.holderList = new HolderList(this.userDetails.user_id),
            this.followerList = new FollowerList(this.userDetails.user_id),
            this.followingList = new FollowingList(this.userDetails.user_id),
          ),
        ),
        new UserPostList(this.userDetails.user_id).show(),
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
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.xUsername = params.xUsername!;
    this.userDetails = UserDetailsCacher.getAndRefreshByXUsername(
      this.xUsername,
    );
    this.subjectDetails = this.userDetails?.wallet_address
      ? SubjectDetailsCacher.getAndRefresh(
        this.userDetails.wallet_address,
      )
      : undefined;
    this.render();
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
