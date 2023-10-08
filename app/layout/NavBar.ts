import { DomNode, el, MaterialIcon } from "common-dapp-module";

export default class NavBar extends DomNode {
  constructor() {
    super(".nav-bar");
    this.append(
      el("h1", el("img", { src: "/images/logo.png" })),
      el("button", new MaterialIcon("home")),
      el("button", new MaterialIcon("inbox")),
      el("button", new MaterialIcon("search")),
      el("button", new MaterialIcon("notifications")),
    );
  }
}
