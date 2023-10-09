import { DomNode, el, View, ViewParams } from "common-dapp-module";
import Layout from "../layout/Layout.js";

export default class UserView extends View {
  private container: DomNode;
  private xUsername!: string;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".user-view",
      ),
    );

    this.xUsername = params.xUsername!;
    this.render();
  }

  private render() {
    this.container.append(el("h1", "@" + this.xUsername));
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.xUsername = params.xUsername!;
    this.render();
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
