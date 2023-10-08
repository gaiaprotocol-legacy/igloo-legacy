import { DomNode, el } from "common-dapp-module";

export default class MobileTitleBar extends DomNode {
  constructor() {
    super(".mobile-title-bar");
    this.append(
      el("h1", el("img", { src: "/images/logo.png" })),
      el("p", "hello, rebecca!"),
      el(".signed-user", {
        //style: { backgroundImage: `url(${SignedUserManager.avatarUrl})` },
      }),
    );
  }
}
