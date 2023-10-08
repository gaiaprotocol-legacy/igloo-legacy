import { BodyNode, DomNode, el, View, ViewParams } from "common-dapp-module";
import MobileTitleBar from "./MobileTitleBar.js";
import NavBar from "./NavBar.js";
import PcTitleBar from "./PcTitleBar.js";
import TrendSection from "./TrendSection.js";

export default class Layout extends View {
  private static current: Layout;

  public static append(node: DomNode): void {
    Layout.current.content.append(node);
  }

  private container: DomNode;
  private navBar: NavBar;
  private content: DomNode;
  private trendSection: TrendSection;

  constructor(params: ViewParams, uri: string) {
    super();
    Layout.current = this;

    BodyNode.append(
      this.container = el(
        ".layout",
        new MobileTitleBar(),
        this.navBar = new NavBar(),
        el(".content-wrapper", new PcTitleBar(), this.content = el("main")),
        this.trendSection = new TrendSection(),
      ),
    );

    this.activeNavBarButton(uri);
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.activeNavBarButton(uri);
  }

  private activeNavBarButton(uri: string): void {
    this.navBar.activeButton(uri === "" ? "home" : uri);
    uri === "explore" ? this.trendSection.hide() : this.trendSection.show();
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
