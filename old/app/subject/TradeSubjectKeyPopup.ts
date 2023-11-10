import {
  Button,
  ButtonType,
  Component,
  DomNode,
  el,
  Popup,
} from "common-app-module";
import { ethers } from "ethers";
import IglooSubjectContract from "../contracts/IglooSubjectContract.js";
import UserDetails from "../database-interface/UserDetails.js";
import BuySubjectKeyPopup from "./BuySubjectKeyPopup.js";
import SellSubjectKeyPopup from "./SellSubjectKeyPopup.js";

export default class TradeSubjectKeyPopup extends Popup {
  public content: DomNode;
  private priceDisplay: DomNode;

  constructor(private userDetails: UserDetails, callback: () => void) {
    super({ barrierDismissible: true });

    this.append(
      this.content = new Component(
        ".popup.trade-subject-key-popup",
        el("header", el("h1", `Buy 1 ${userDetails.display_name}'s Ice`)),
        el(
          "main",
          el(
            ".owner-profile-image-wrapper",
            el(".owner-profile-image", {
              style: {
                backgroundImage: `url(${
                  userDetails.profile_image?.replace("_normal", "")
                })`,
              },
            }),
          ),
          el(
            ".price-info",
            el(
              ".price",
              el("label", "Price"),
              el(
                ".value",
                this.priceDisplay = el("span", "..."),
                el("img.avax-symbol", { src: "/images/avax-symbol.svg" }),
              ),
            ),
          ),
          new Button({
            type: ButtonType.Contained,
            tag: ".buy-key",
            click: () => {
              new BuySubjectKeyPopup(userDetails, callback);
              this.delete();
            },
            title: `Buy 1 ${userDetails.display_name}'s Ice`,
          }),
          new Button({
            type: ButtonType.Contained,
            tag: ".sell-key",
            click: () => {
              new SellSubjectKeyPopup(userDetails, callback);
              this.delete();
            },
            title: `Sell 1 ${userDetails.display_name}'s Ice`,
          }),
        ),
        el(
          "footer",
          new Button({
            type: ButtonType.Text,
            tag: ".cancel-button",
            click: () => this.delete(),
            title: "Cancel",
          }),
        ),
      ),
    );

    this.fetchPrice();
  }

  private async fetchPrice() {
    const price = await IglooSubjectContract.getBuyPrice(
      this.userDetails.wallet_address!,
      1n,
    );
    this.priceDisplay.text = `${ethers.formatEther(price)}`;
  }
}
