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
  private tabs: Tabs;
  private globalPostList: GlobalPostList;
  private followingPostList: FollowingPostList;
  private keyHeldPostList: KeyHeldPostList;
  private postButton: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".home-view",
        el(
          "main",
          el("h1", "Home"),
          this.tabs = new Tabs("home-view-tabs", [
            { id: "global", label: "Global" },
            { id: "following", label: "Following" },
            { id: "held", label: "Held" },
          ]),
          this.globalPostList = new GlobalPostList(),
          this.followingPostList = new FollowingPostList(),
          this.keyHeldPostList = new KeyHeldPostList(),
        ),
        this.postButton = el("button.post", new MaterialIcon("add"), {
          click: () => new PostPopup(),
        }),
      ),
    );

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

    this.checkSigned();
    this.container.onDelegate(
      SignedUserManager,
      "userFetched",
      () => this.checkSigned(),
    );
  }

  private checkSigned() {
    !SignedUserManager.signed
      ? this.postButton.addClass("hidden")
      : this.postButton.deleteClass("hidden");
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
