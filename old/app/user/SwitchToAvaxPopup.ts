import { switchNetwork } from "@wagmi/core";
import {
  Alert,
  Button,
  ButtonType,
  Component,
  DomNode,
  el,
  Popup,
} from "@common-module/app";
import EnvironmentManager from "../EnvironmentManager.js";

export default class SwitchToAvaxPopup extends Popup {
  public content: DomNode;

  constructor() {
    super({ barrierDismissible: true });
    this.append(
      this.content = new Component(
        ".popup.switch-to-avax-popup",
        el("header", el("h1", "Switch to Avalanche for Igloo")),
        el(
          "main",
          el("img.banner", { src: "/images/avax-banner.jpg" }),
          el(
            "p",
            "Igloo operates on Avalanche. To utilize Igloo, please change your wallet's chain to Avalanche.",
          ),
          el(
            "p",
            el("a", "What is Avalanche?", {
              href: "https://www.avax.network/",
              target: "_blank",
            }),
          ),
        ),
        el(
          "footer",
          new Button({
            type: ButtonType.Text,
            tag: ".cancel-button",
            click: () => {
              new Alert({
                title: "Warning",
                message:
                  "If you do not switch to Avalanche, Igloo may not function properly. Ensure you change the chain for a seamless experience.",
                confirmTitle: "Understood",
              });
              this.delete();
            },
            title: "Later",
          }),
          new Button({
            tag: ".switch-button",
            click: async () => {
              await switchNetwork({ chainId: EnvironmentManager.avaxChainId });
              this.delete();
            },
            title: "Switch Now",
          }),
        ),
      ),
    );
  }
}
