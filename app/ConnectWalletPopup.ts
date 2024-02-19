import {
  Button,
  ButtonType,
  Component,
  el,
  Icon,
  Popup,
} from "@common-module/app";
import { WalletConnectManager, WalletManager } from "esf-module";
import ParticleAuthManager from "./ParticleAuthManager.js";

export default class ConnectWalletPopup extends Popup {
  private resolve: ((value: WalletManager) => void) | undefined;
  private reject: (() => void) | undefined;

  constructor() {
    super({ barrierDismissible: true });
    this.append(
      new Component(
        ".popup.connect-wallet-popup",
        el(
          "header",
          el("h1", "Connect Wallet"),
          new Button({
            tag: ".close",
            type: ButtonType.Text,
            icon: new Icon("x"),
            click: () => this.delete(),
          }),
        ),
        el(
          "main",
          new Button({
            icon: el(
              "img",
              { src: "/images/wallet-logos/particle.png" },
            ),
            title: "Social Login (via Particle Auth)",
            click: async () => {
              const connected = await ParticleAuthManager.connect();
              if (connected) {
                this.resolve?.(ParticleAuthManager);
                this.reject = undefined;
                this.delete();
              }
            },
          }),
          new Button({
            icon: el(
              "img",
              { src: "/images/wallet-logos/walletconnect.png" },
            ),
            title: "WalletConnect (MetaMask, etc.)",
            click: async () => {
              const connected = await WalletConnectManager.connect();
              if (connected) {
                this.resolve?.(WalletConnectManager);
                this.reject = undefined;
                this.delete();
              }
            },
          }),
        ),
        el(
          "footer",
          new Button({
            title: "Cancel",
            click: () => this.delete(),
          }),
        ),
      ),
    );

    this.on("delete", () => this.reject?.());
  }

  public async wait(): Promise<WalletManager> {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
