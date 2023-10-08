import { BodyNode, DomNode, el, View, ViewParams } from "common-dapp-module";
import MobileTitle from "./layout-components/MobileTitle.js";
import NavBar from "./layout-components/NavBar.js";
import PcTitle from "./layout-components/PcTitle.js";
import TrendSection from "./layout-components/TrendSection.js";

export default class Layout extends View {
  private static current: Layout;

  public static append(node: DomNode): void {
    Layout.current.content.append(node);
  }

  private container: DomNode;
  private content: DomNode;

  constructor(params: ViewParams, uri: string) {
    super();
    Layout.current = this;

    BodyNode.append(
      this.container = el(
        ".layout",
        new MobileTitle(),
        new NavBar(),
        el(".content-wrapper", new PcTitle(), this.content = el("main")),
        new TrendSection(),
      ),
    );
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
