import { el, Tabs, View, ViewParams } from "common-app-module";
import { FollowingPostList, GlobalPostList } from "sofi-module";
import IglooPost from "../database-interface/IglooPost.js";
import IglooLottieAnimation from "../IglooLottieAnimation.js";
import Layout from "../layout/Layout.js";
import MaterialIcon from "../MaterialIcon.js";
import IglooPostInteractions from "../post/IglooPostInteractions.js";
import IglooPostService from "../post/IglooPostService.js";
import PostPopup from "../post/PostPopup.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
import KeyHeldPostList from "./KeyHeldPostList.js";

export default class HomeView extends View {
  private tabs: Tabs | undefined;
  private globalPostList: GlobalPostList<IglooPost>;
  private followingPostList: FollowingPostList<IglooPost> | undefined;
  private keyHeldPostList: KeyHeldPostList | undefined;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".home-view",
        el(
          "main",
          IglooSignedUserManager.signed
            ? this.tabs = new Tabs(
              "home-view-tabs",
              IglooSignedUserManager.walletLinked
                ? [
                  { id: "global", label: "Global" },
                  { id: "following", label: "Following" },
                  { id: "held", label: "Held" },
                ]
                : [
                  { id: "global", label: "Global" },
                  { id: "following", label: "Following" },
                ],
            )
            : undefined,
          this.globalPostList = new GlobalPostList<IglooPost>(
            IglooPostService,
            {
              signedUserId: IglooSignedUserManager.user?.user_id,
              wait: true,
            },
            IglooPostInteractions,
            new IglooLottieAnimation(),
          ),
          IglooSignedUserManager.signed
            ? this.followingPostList = new FollowingPostList(
              IglooPostService,
              {
                signedUserId: IglooSignedUserManager.user?.user_id!,
                wait: true,
              },
              IglooPostInteractions,
              new IglooLottieAnimation(),
            )
            : undefined,
          IglooSignedUserManager.walletLinked
            ? this.keyHeldPostList = new KeyHeldPostList()
            : undefined,
        ),
        el("button.post", new MaterialIcon("add"), {
          click: () => new PostPopup(),
        }),
      ),
    );

    if (!this.tabs) {
      this.globalPostList.show();
    } else {
      this.tabs.on("select", (id: string) => {
        [this.globalPostList, this.followingPostList, this.keyHeldPostList]
          .forEach((list) => list?.hide());
        if (id === "global") this.globalPostList.show();
        else if (id === "following") this.followingPostList?.show();
        else if (id === "held") this.keyHeldPostList?.show();
      }).init();
    }
  }
}
