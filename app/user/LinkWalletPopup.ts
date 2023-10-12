import {
  Button,
  ButtonType,
  Component,
  DomNode,
  el,
  Popup,
} from "common-dapp-module";
import UserWalletLinker from "./UserWalletLinker.js";
import WalletManager from "./WalletManager.js";

export default class LinkWalletPopup extends Popup {
  public content: DomNode;
  private linkButton: Button;

  constructor() {
    super({ barrierDismissible: true });
    this.append(
      this.content = new Component(
        ".popup.link-wallet-popup",
        el("header", el("h1", "Link Wallet")),
        el(
          "main",
          el(
            "p",
            "To link your wallet to account, please follow the steps below:",
          ),
          el(
            "ol",
            el(
              "li",
              "Ensure your crypto wallet is connected.",
              el("w3m-core-button"),
            ),
            el(
              "li",
              'Click the "Link Wallet" button below.',
            ),
          ),
        ),
        el(
          "footer",
          new Button({
            type: ButtonType.Text,
            tag: ".cancel-button",
            click: () => this.delete(),
            title: "Cancel",
          }),
          this.linkButton = new Button({
            tag: ".link-wallet-button",
            click: async (event, button) => {
              try {
                button.disable().title = "Linking...";
                await UserWalletLinker.link();
                this.delete();
              } catch (error) {
                console.error(error);
                button.enable().title = "Link Wallet";
              }
            },
            title: "Link Wallet",
          }),
        ),
      ),
    );

    this.checkWallet();
    this.onDelegate(WalletManager, "accountChanged", () => this.checkWallet());
  }

  private checkWallet() {
    WalletManager.connected
      ? this.linkButton.enable()
      : this.linkButton.disable();
  }
}
