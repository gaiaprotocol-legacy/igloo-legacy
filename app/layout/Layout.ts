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

  constructor(params: ViewParams, uri: string) {
    super();
    Layout.current = this;

    BodyNode.append(
      this.container = el(
        ".layout",
        new MobileTitleBar(),
        this.navBar = new NavBar(),
        el(".content-wrapper", new PcTitleBar(), this.content = el("main")),
        new TrendSection(),
      ),
    );

    this.activeNavBarButton(uri);
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.activeNavBarButton(uri);
  }

  private activeNavBarButton(buttonName: string): void {
    this.navBar.activeButton(buttonName === "" ? "home" : buttonName);
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
