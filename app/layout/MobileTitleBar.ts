import { DomNode, el, Router } from "common-dapp-module";

export default class MobileTitleBar extends DomNode {
  constructor() {
    super(".mobile-title-bar");
    this.append(
      el("h1", el("img", { src: "/images/logo.png" }), {
        click: () => Router.go("/"),
      }),
      el("p", "hello, rebecca!"),
      el("a.signed-user", {
        //style: { backgroundImage: `url(${SignedUserManager.avatarUrl})` },
      }),
    );
  }
}
