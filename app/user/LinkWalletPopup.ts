import { Component, DomNode, Popup } from "common-dapp-module";

export default class LinkWalletPopup extends Popup {
  public content: DomNode;

  constructor() {
    super({ barrierDismissible: true });
    this.append(
      this.content = new Component(
        ".popup.link-wallet-popup",
      ),
    );
  }
}
