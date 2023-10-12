import { Component, DomNode, Popup, el } from "common-dapp-module";

export default class LinkWalletPopup extends Popup {
  public content: DomNode;

  constructor() {
    super({ barrierDismissible: true });
    this.append(
      this.content = new Component(
        ".popup.link-wallet-popup",
        el("header", el("h1", "Link Wallet")),
        el("main"),
        el("footer"),
      ),
    );
  }
}
