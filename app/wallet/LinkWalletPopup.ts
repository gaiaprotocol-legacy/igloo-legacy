import {
  Button,
  ButtonType,
  Component,
  DomNode,
  el,
  msg,
  Popup,
} from "@common-module/app";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
import WalletManager from "./WalletManager.js";

export default class LinkWalletPopup extends Popup {
  private linkButton: Button;

  constructor() {
    super({ barrierDismissible: true });
    this.append(
      new Component(
        ".popup.link-wallet-popup",
        el("header", el("h1", msg("link-wallet-popup-title"))),
        el(
          "main",
          el("p", msg("link-wallet-popup-instructions")),
          el(
            "ol",
            el("li", msg("link-wallet-popup-step-1"), el("w3m-core-button")),
            el("li", msg("link-wallet-popup-step-2")),
          ),
        ),
        el(
          "footer",
          new Button({
            type: ButtonType.Text,
            tag: ".cancel-button",
            click: () => this.delete(),
            title: msg("link-wallet-popup-cancel-button"),
          }),
          this.linkButton = new Button({
            tag: ".link-wallet-button",
            click: async (event, button) => {
              try {
                button.disable().title = msg(
                  "link-wallet-popup-linking-button",
                );
                await IglooSignedUserManager.linkWallet();
                this.delete();
              } catch (error) {
                console.error(error);
                button.enable().title = msg("link-wallet-popup-link-button");
              }
            },
            title: msg("link-wallet-popup-link-button"),
          }),
        ),
      ),
    );

    this.checkWalletConnected();
    this.onDelegate(
      WalletManager,
      "accountChanged",
      () => this.checkWalletConnected(),
    );
  }

  private checkWalletConnected() {
    WalletManager.connected
      ? this.linkButton.enable()
      : this.linkButton.disable();
  }
}
