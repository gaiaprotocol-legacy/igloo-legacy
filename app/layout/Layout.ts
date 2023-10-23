import { BodyNode, DomNode, el, View, ViewParams } from "common-dapp-module";
import MobileTitleBar from "./MobileTitleBar.js";
import NavBar from "./NavBar.js";
import TopUserSection from "./TopUserSection.js";
import TrendSection from "./TrendSection.js";

export default class Layout extends View {
  private static current: Layout;

  public static append(node: DomNode): void {
    Layout.current.content.append(node);
  }

  private container: DomNode;
  private mobileTitleBar: MobileTitleBar;
  private navBar: NavBar;
  private content: DomNode;
  private trendSection: TrendSection;
  private topUserSection: TopUserSection;

  constructor(params: ViewParams, uri: string) {
    super();
    Layout.current = this;

    BodyNode.append(
      this.container = el(
        ".layout",
        this.mobileTitleBar = new MobileTitleBar(),
        this.navBar = new NavBar(),
        this.content = el("main"),
        this.trendSection = new TrendSection(),
        this.topUserSection = new TopUserSection(),
      ),
    );

    this.activeNavBarButton(uri);
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.activeNavBarButton(uri);
  }

  private activeNavBarButton(uri: string): void {
    this.navBar.activeButton(
      uri === "" ? "home" : uri.substring(
        0,
        uri.indexOf("/") === -1 ? uri.length : uri.indexOf("/"),
      ),
    );
    uri === "explore" || uri === "search" || uri === "chats" ||
      uri.startsWith("chats/")
      ? this.trendSection.hide()
      : this.trendSection.show();
    uri === "explore" || uri === "search"
      ? this.topUserSection.show()
      : this.topUserSection.hide();
    this.mobileTitleBar.uri = uri;
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
