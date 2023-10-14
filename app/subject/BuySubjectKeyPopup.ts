import {
  Button,
  ButtonType,
  Component,
  DomNode,
  el,
  Popup,
} from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";

export default class BuySubjectKeyPopup extends Popup {
  public content: DomNode;
  private priceDisplay: DomNode;
  private totalPriceDisplay: DomNode;

  constructor(userDetails: UserDetails) {
    super({ barrierDismissible: true });

    //TODO:
    const price = 123;

    this.append(
      this.content = new Component(
        ".popup.buy-subject-key-popup",
        el("header", el("h1", `Buy 1 ${userDetails.display_name}'s Key`)),
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
              this.priceDisplay = el(".value", "0.0000625 AVAX"),
            ),
            el(
              ".price",
              el("label", "Total (including fee)"),
              this.totalPriceDisplay = el(".value", "0.0000625 AVAX"),
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
          new Button({
            type: ButtonType.Contained,
            tag: ".buy-token-button",
            click: async () => {
              /*const balance = await WalletManager.getBalance();
              if (balance < this.totalPrice) {
                new ErrorAlert({
                  title: "Insufficient balance",
                  message: `You need at least ${
                    ethers.formatEther(this.totalPrice)
                  } ETH to buy this token`,
                });
              } else {
                this.buyButton.disable();
                this.buyButton.title = "Buying...";

                try {
                  await PalContract.buyToken(
                    this.tokenAddress,
                    ethers.parseEther(this.amountInput.value),
                    this.totalPrice,
                  );

                  SupabaseManager.supabase.functions.invoke("track-events");
                  SupabaseManager.supabase.functions.invoke(
                    "refresh-token-prices-and-balances",
                    {
                      body: {
                        tokenAddresses: [this.tokenAddress],
                      },
                    },
                  );

                  this.fireEvent("buyToken");
                  this.delete();
                } catch (e) {
                  console.error(e);

                  this.buyButton.enable();
                  this.buyButton.title = "Buy Token";
                }
              }*/
            },
            title: `Buy 1 ${userDetails.display_name}'s Key`,
          }),
        ),
      ),
    );
  }
}
