import {
  DomNode,
  el,
  Supabase,
  Tabs,
  View,
  ViewParams,
} from "@common-module/app";
import { SocialUserPublic, TempUserPublicCacher } from "@common-module/social";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import Layout from "../layout/Layout.js";
import MaterialIcon from "../MaterialIcon.js";
import UserCommentPostList from "../post/UserCommentPostList.js";
import UserLikedPostList from "../post/UserLikedPostList.js";
import UserPostList from "../post/UserPostList.js";
import UserRepostList from "../post/UserRepostList.js";
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

  private xUsername!: string;
  private userDetails!: SocialUserPublic;
  private subjectDetails: SubjectDetails | undefined;
  private holdingCount = 0;

  private userConnectionTabs!: Tabs;
  private holdingList: HoldingList | undefined;
  private holderList: HolderList | undefined;
  private followingList!: FollowingList;
  private followerList!: FollowerList;

  private postTabs!: Tabs;
  private userPostList!: UserPostList;
  private userCommentPostList!: UserCommentPostList;
  private userRepostList!: UserRepostList;
  private userLikedPostList!: UserLikedPostList;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".user-view",
      ),
    );

    this.xUsername = params.xUsername!;
    this.load();
    /*this.container.onDelegate(
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
    );*/

    //this.trackPriceAndBalance();
  }

  private async load() {
    const cached = TempUserPublicCacher.getByXUsername(this.xUsername);
    console.log(cached);
    if (cached) {
      this.userDetails = cached;
      this.render();
    }
    this.userDetails = await UserDetailsCacher.refreshByXUsername(
      this.xUsername,
    );
    this.render();
    this.trackPriceAndBalance();
  }

  private async render() {
    if (this.userDetails.wallet_address) {
      [this.subjectDetails, this.holdingCount] = await Promise.all([
        SubjectDetailsCacher.refresh(this.userDetails.wallet_address),
        TotalSubjectKeyBalanceCacher.refresh(this.userDetails.wallet_address),
      ]);
    } else {
      this.subjectDetails = undefined;
      this.holdingCount = 0;
    }

    let userProfileDisplay;
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
        userProfileDisplay = new UserProfileDisplay(
          this.userDetails,
          this.subjectDetails,
          this.holdingCount,
        ),
        el(
          ".user-connections",
          this.userConnectionTabs = new Tabs(
            "user-connections",
            (() => {
              const tabs = this.userDetails.wallet_address
                ? [{
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
                }]
                : [];
              tabs.push({
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
              });
              return tabs;
            })(),
          ),
          this.userDetails.wallet_address
            ? this.holdingList = new HoldingList(
              this.userDetails.wallet_address,
            )
            : undefined,
          this.userDetails.wallet_address
            ? this.holderList = new HolderList(this.userDetails.wallet_address)
            : undefined,
          this.followingList = new FollowingList(this.userDetails.user_id),
          this.followerList = new FollowerList(this.userDetails.user_id),
        ),
      ),
      this.postTabs = new Tabs("user-posts", [
        { id: "user-posts", label: "Posts" },
        { id: "user-replies", label: "Replies" },
        { id: "user-reposts", label: "Reposts" },
        { id: "user-likes", label: "Likes" },
      ]),
      this.userPostList = new UserPostList(this.userDetails.user_id),
      this.userCommentPostList = new UserCommentPostList(
        this.userDetails.user_id,
      ),
      this.userRepostList = new UserRepostList(this.userDetails.user_id),
      this.userLikedPostList = new UserLikedPostList(this.userDetails.user_id),
    );

    userProfileDisplay.on("trade-key", () => this.load());

    this.userConnectionTabs.on("select", (id: string) => {
      [
        this.holdingList,
        this.holderList,
        this.followingList,
        this.followerList,
      ]
        .forEach((list) => list?.hide());
      if (id === "holdings") this.holdingList?.show();
      else if (id === "holders") this.holderList?.show();
      else if (id === "following") this.followingList.show();
      else if (id === "followers") this.followerList.show();
    }).init();

    this.postTabs.on("select", (id: string) => {
      [
        this.userPostList,
        this.userCommentPostList,
        this.userRepostList,
        this.userLikedPostList,
      ]
        .forEach((list) => list.hide());
      if (id === "user-posts") this.userPostList.show();
      else if (id === "user-replies") this.userCommentPostList.show();
      else if (id === "user-reposts") this.userRepostList.show();
      else if (id === "user-likes") this.userLikedPostList.show();
    }).init();
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.xUsername = params.xUsername!;
    this.load();
    //this.trackPriceAndBalance();
  }

  private trackPriceAndBalance(): void {
    if (this.userDetails.wallet_address) {
      Supabase.client.functions.invoke("track-subject-price-and-balance", {
        body: { subjects: [this.userDetails.wallet_address] },
      });
    }
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
