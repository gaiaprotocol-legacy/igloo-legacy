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
import TotalSubjectKeyBalanceCacher from "../subject/TotalSubjectKeyBalanceCacher.js";
import FollowerList from "./FollowerList.js";
import FollowingList from "./FollowingList.js";
import HolderList from "./HolderList.js";
import HoldingList from "./HoldingList.js";
import UserDetailsCacher from "./UserDetailsCacher.js";
import UserProfileDisplay from "./UserProfileDisplay.js";

export default class UserView extends View {
  private container: DomNode;
  private tabs!: Tabs;
  private xUsername!: string;
  private userDetails: UserDetails;
  private subjectDetails: SubjectDetails | undefined;
  private holdingCount = 0;

  private holdingList!: HoldingList;
  private holderList!: HolderList;
  private followingList!: FollowingList;
  private followerList!: FollowerList;

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
    this.subjectDetails = this.userDetails.wallet_address
      ? SubjectDetailsCacher.getAndRefresh(
        this.userDetails.wallet_address,
      )
      : undefined;
    this.holdingCount = this.userDetails.wallet_address
      ? TotalSubjectKeyBalanceCacher.getAndRefresh(
        this.userDetails.wallet_address,
      )
      : 0;

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
        if (updatedDetails.subject === this.userDetails.wallet_address) {
          this.subjectDetails = updatedDetails;
          this.render();
        }
      },
    );
    this.container.onDelegate(
      TotalSubjectKeyBalanceCacher,
      "update",
      ({ walletAddress, totalKeyBalance }) => {
        if (walletAddress === this.userDetails.wallet_address) {
          this.holdingCount = totalKeyBalance;
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
        el("h1", `${this.userDetails.display_name}'s Igloo`),
      ),
      el(
        "section.profile",
        new UserProfileDisplay(
          this.userDetails,
          this.subjectDetails,
          this.holdingCount,
        ),
        el(
          ".user-connections",
          this.tabs = new Tabs(
            "user-connections",
            [{
              id: "holdings",
              label: [
                el("span.value", String(this.holdingCount)),
                "Holdings",
              ],
            }, {
              id: "holders",
              label: [
                el(
                  "span.value",
                  this.subjectDetails
                    ? String(this.subjectDetails.key_holder_count)
                    : "0",
                ),
                "Holders",
              ],
            }, {
              id: "following",
              label: [
                el("span.value", String(this.userDetails.following_count)),
                "Following",
              ],
            }, {
              id: "followers",
              label: [
                el("span.value", String(this.userDetails.follower_count)),
                "Followers",
              ],
            }],
          ),
          this.holdingList = new HoldingList(this.userDetails.user_id),
          this.holderList = new HolderList(this.userDetails.user_id),
          this.followingList = new FollowingList(this.userDetails.user_id),
          this.followerList = new FollowerList(this.userDetails.user_id),
        ),
      ),
      new UserPostList(this.userDetails.user_id).show(),
    );

    this.tabs.on("select", (id: string) => {
      [
        this.holdingList,
        this.holderList,
        this.followingList,
        this.followerList,
      ]
        .forEach((list) => list.hide());
      if (id === "holdings") {
        this.holdingList.show();
      } else if (id === "holders") {
        this.holderList.show();
      } else if (id === "following") {
        this.followingList.show();
      } else if (id === "followers") {
        this.followerList.show();
      }
    }).init();
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.xUsername = params.xUsername!;
    this.userDetails = UserDetailsCacher.getAndRefreshByXUsername(
      this.xUsername,
    );
    this.subjectDetails = this.userDetails.wallet_address
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
