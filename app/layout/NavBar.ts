import { DomNode, el, MaterialIcon, Router } from "common-dapp-module";

export default class NavBar extends DomNode {
  constructor() {
    super(".nav-bar");
    this.append(
      el("h1", el("img", { src: "/images/logo.png" }), {
        click: () => Router.go("/"),
      }),
      el("button", new MaterialIcon("home"), {
        click: () => Router.go("/"),
      }),
      el("button", new MaterialIcon("inbox"), {
        click: () => Router.go("/inbox"),
      }),
      el("button", new MaterialIcon("search"), {
        click: () => Router.go("/explore"),
      }),
      el("button", new MaterialIcon("notifications"), {
        click: () => Router.go("/notifications"),
      }),
      el("a.signed-user", {
        //style: { backgroundImage: `url(${SignedUserManager.avatarUrl})` },
      }),
    );
  }
}
