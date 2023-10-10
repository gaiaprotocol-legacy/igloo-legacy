import {
    DomNode,
    el,
    MaterialIcon,
    View,
    ViewParams,
  } from "common-dapp-module";
  import Layout from "../layout/Layout.js";
  
  export default class MobileFollowingView extends View {
    private container: DomNode;
    private xUsername!: string;
  
    constructor(params: ViewParams) {
      super();
      Layout.append(
        this.container = el(
          ".mobile-following-view",
        ),
      );
  
      this.xUsername = params.xUsername!;
      this.render();
    }
  
    private render() {
      this.container.append(
        el(
          "header",
          el("button", new MaterialIcon("arrow_back"), {
            click: () => history.back(),
          }),
          el("h1", "@" + this.xUsername),
        ),
      );
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
  