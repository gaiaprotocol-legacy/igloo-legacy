import {
  DomNode,
  el,
  MaterialIcon,
  Tabs,
  View,
  ViewParams,
} from "common-dapp-module";
import Layout from "./layout/Layout.js";
import FollowingPostList from "./post/FollowingPostList.js";
import GlobalPostList from "./post/GlobalPostList.js";
import KeyHeldPostList from "./post/KeyHeldPostList.js";
import PostPopup from "./post/PostPopup.js";
import SignedUserManager from "./user/SignedUserManager.js";

export default class HomeView extends View {
  private container: DomNode;

  private tabs: Tabs | undefined;
  private globalPostList!: GlobalPostList;
  private followingPostList!: FollowingPostList;
  private keyHeldPostList!: KeyHeldPostList;
  private postButton!: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".home-view",
      ),
    );

    this.render();
    this.container.onDelegate(
      SignedUserManager,
      "userFetched",
      () => this.render(),
    );
  }

  private render() {
    this.container.empty().append(
      el(
        "main",
        el("h1", "Home"),
        SignedUserManager.signed
          ? this.tabs = new Tabs(
            "home-view-tabs",
            SignedUserManager.walletLinked
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
        this.globalPostList = new GlobalPostList(),
        SignedUserManager.userId
          ? (this.followingPostList = new FollowingPostList(
            SignedUserManager.userId,
          ))
          : undefined,
        SignedUserManager.walletAddress
          ? this.keyHeldPostList = new KeyHeldPostList(SignedUserManager.walletAddress)
          : undefined,
      ),
      this.postButton = el("button.post", new MaterialIcon("add"), {
        click: () => new PostPopup(),
      }),
    );

    if (!this.tabs) {
      this.globalPostList.show();
    } else {
      this.tabs.on("select", (id: string) => {
        [this.globalPostList, this.followingPostList, this.keyHeldPostList]
          .forEach((list) => list.hide());
        if (id === "global") {
          this.globalPostList.show();
        } else if (id === "following") {
          this.followingPostList.show();
        } else if (id === "held") {
          this.keyHeldPostList.show();
        }
      }).init();
    }
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
