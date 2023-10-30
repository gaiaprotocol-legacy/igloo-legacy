import {
  Button,
  ButtonType,
  Component,
  DomNode,
  el,
  ErrorAlert,
  Popup,
} from "common-app-module";
import { ethers } from "ethers";
import IglooSubjectContract from "../contracts/IglooSubjectContract.js";
import UserDetails from "../database-interface/UserDetails.js";
import SignedUserManager from "../user/SignedUserManager.js";
import WalletManager from "../user/WalletManager.js";
import SubjectKeyService from "./SubjectKeyService.js";

export default class BuySubjectKeyPopup extends Popup {
  public content: DomNode;
  private priceDisplay: DomNode;
  private totalPriceDisplay: DomNode;
  private buyButton: Button;

  constructor(private userDetails: UserDetails) {
    super({ barrierDismissible: true });

    this.append(
      this.content = new Component(
        ".popup.buy-subject-key-popup",
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
            el(
              ".price",
              el("label", "Total (including fee)"),
              el(
                ".value",
                this.totalPriceDisplay = el("span", "..."),
                el("img.avax-symbol", { src: "/images/avax-symbol.svg" }),
              ),
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
          this.buyButton = new Button({
            type: ButtonType.Contained,
            tag: ".buy-token-button",
            click: () => this.buyKey(),
            title: `Buy 1 ${userDetails.display_name}'s Ice`,
          }),
        ),
      ),
    );

    this.fetchPrice();
    this.fetchTotalPrice();
  }

  private async fetchPrice() {
    const price = await IglooSubjectContract.getBuyPrice(
      this.userDetails.wallet_address!,
      1n,
    );
    this.priceDisplay.text = `${ethers.formatEther(price)}`;
  }

  private async fetchTotalPrice() {
    const price = await IglooSubjectContract.getBuyPriceAfterFee(
      this.userDetails.wallet_address!,
      1n,
    );
    this.totalPriceDisplay.text = `${ethers.formatEther(price)}`;
  }

  private async buyKey() {
    this.buyButton.disable().title = "Buying...";

    try {
      const subject = this.userDetails.wallet_address!;

      if (!WalletManager.connected) await WalletManager.connect();

      if (WalletManager.address !== SignedUserManager.walletAddress) {
        new ErrorAlert({
          title: "Wrong wallet",
          message:
            "You are connected to the wrong wallet. Linked wallet address: " +
            SignedUserManager.walletAddress,
        });
        throw new Error("Wrong wallet");
      }

      const [balance, totalPrice] = await Promise.all([
        WalletManager.getBalance(),
        IglooSubjectContract.getBuyPriceAfterFee(subject, 1n),
      ]);

      if (balance < totalPrice) {
        new ErrorAlert({
          title: "Insufficient balance",
          message: `You need at least ${
            ethers.formatEther(totalPrice)
          } AVAX to buy this ice.`,
        });
        throw new Error("Insufficient balance");
      } else {
        await SubjectKeyService.buyKey(subject, totalPrice);
        this.delete();
      }
    } catch (e) {
      console.error(e);
      this.buyButton.enable().title =
        `Buy 1 ${this.userDetails.display_name}'s Ice`;
    }
  }
}
