import {
  Button,
  ButtonType,
  Component,
  DomNode,
  el,
  ErrorAlert,
  Popup,
} from "@common-module/app";
import { ethers } from "ethers";
import IglooSubjectContract from "../contracts/IglooSubjectContract.js";
import UserDetails from "../database-interface/UserDetails.js";
import SignedUserManager from "../user/SignedUserManager.js";
import WalletManager from "../user/WalletManager.js";
import SubjectKeyService from "./SubjectKeyService.js";

export default class SellSubjectKeyPopup extends Popup {
  public content: DomNode;
  private priceDisplay: DomNode;
  private totalPriceDisplay: DomNode;
  private sellButton: Button;

  constructor(private userDetails: UserDetails, private callback: () => void) {
    super({ barrierDismissible: true });

    this.append(
      this.content = new Component(
        ".popup.sell-subject-key-popup",
        el("header", el("h1", `Sell 1 ${userDetails.display_name}'s Ice`)),
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
          this.sellButton = new Button({
            type: ButtonType.Contained,
            tag: ".sell-token-button",
            click: () => this.sellKey(),
            title: `Sell 1 ${userDetails.display_name}'s Ice`,
          }),
        ),
      ),
    );

    this.fetchPrice();
    this.fetchTotalPrice();
  }

  private async fetchPrice() {
    const price = await IglooSubjectContract.getSellPrice(
      this.userDetails.wallet_address!,
      1n,
    );
    this.priceDisplay.text = `${ethers.formatEther(price)}`;
  }

  private async fetchTotalPrice() {
    const price = await IglooSubjectContract.getSellPriceAfterFee(
      this.userDetails.wallet_address!,
      1n,
    );
    this.totalPriceDisplay.text = `${ethers.formatEther(price)}`;
  }

  private async sellKey() {
    this.sellButton.disable().title = "Selling...";

    try {
      const subject = this.userDetails.wallet_address!;

      if (!WalletManager.connected) await WalletManager.connect();

      if (
        !WalletManager.address ||
        WalletManager.address !== SignedUserManager.walletAddress
      ) {
        new ErrorAlert({
          title: "Wrong wallet",
          message:
            "You are connected to the wrong wallet. Linked wallet address: " +
            SignedUserManager.walletAddress,
        });
        throw new Error("Wrong wallet");
      }

      const keysBalance = await IglooSubjectContract.getKeysBalance(
        subject,
        WalletManager.address,
      );

      if (keysBalance < 1n) {
        new ErrorAlert({
          title: "Insufficient balance",
          message: `You need at least 1 ice to sell.`,
        });
        throw new Error("Insufficient balance");
      } else {
        await SubjectKeyService.sellKey(subject);
        this.callback();
        this.delete();
      }
    } catch (e) {
      console.error(e);
      this.sellButton.enable().title =
        `Sell 1 ${this.userDetails.display_name}'s Ice`;
    }
  }
}
