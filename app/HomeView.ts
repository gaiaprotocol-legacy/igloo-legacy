import {
  DomNode,
  el,
  MaterialIcon,
  Tabs,
  View,
  ViewParams,
} from "common-dapp-module";
import Layout from "./layout/Layout.js";
import PostPopup from "./post/PostPopup.js";
import SignedUserManager from "./user/SignedUserManager.js";

export default class HomeView extends View {
  private container: DomNode;
  private tabs: Tabs;
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
        ),
        this.postButton = el("button.post", new MaterialIcon("add"), {
          click: () => new PostPopup(),
        }),
      ),
    );

    this.tabs.init();

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
