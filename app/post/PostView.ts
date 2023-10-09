import { DomNode, el, MaterialIcon, View, ViewParams } from "common-dapp-module";
import Layout from "../layout/Layout.js";

export default class PostView extends View {
  private container: DomNode;

  private postId: number;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".post-view",
      ),
    );

    this.postId = parseInt(params.postId!);
    this.render();
  }

  private render() {
    this.container.empty().append(
      el(
        "header",
        el("button", new MaterialIcon("arrow_back"), {
          click: () => history.back(),
        }),
        el("h1", "Post"),
      ),
    );
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.postId = parseInt(params.postId!);
    this.render();
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
