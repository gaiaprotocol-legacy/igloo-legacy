import { DomNode, el, MaterialIcon } from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";

export default class UserProfileDisplay extends DomNode {
  constructor(userDetails: UserDetails) {
    super(".user-profile-display");
    this.append(
      el(
        ".profile",
        el(
          ".profile-image-wrapper",
          el(".profile-image", {
            style: {
              backgroundImage: `url(${
                userDetails.profile_image?.replace("_normal", "")
              })`,
            },
          }),
        ),
        el("h2", userDetails.display_name),
        el(
          "h3",
          el(
            "a",
            "@" + userDetails.x_username,
            {
              href: `https://x.com/${userDetails.x_username}`,
              target: "_blank",
            },
          ),
        ),
        el(
          ".socials",
          el(
            "a",
            el("img.x-symbol", { src: "/images/x-symbol.svg" }),
            {
              href: `https://x.com/${userDetails.x_username}`,
              target: "_blank",
            },
          ),
        ),
      ),
      el(
        ".trading-metrics",
        el(
          "section.trading-volume",
          el(".icon-container", new MaterialIcon("analytics")),
          el(".metric", el("h3", "Volume"), el(".value", "0.00 X")),
        ),
        el(
          "section.earned",
          el(".icon-container", new MaterialIcon("savings")),
          el(".metric", el("h3", "Fees Earned"), el(".value", "0.00 X")),
        ),
        el(
          "section.holdings",
          el(".icon-container", new MaterialIcon("account_balance_wallet")),
          el(".metric", el("h3", "Holdings"), el(".value", "0")),
        ),
        el(
          "section.price",
          el(".icon-container", new MaterialIcon("sell")),
          el(".metric", el("h3", "Price"), el(".value", "0.00 X")),
        ),
      ),
      el(
        ".action-buttons",
        el("button.follow", "Follow"),
        el("button.buy-key", "Buy Key"),
      ),
      el(
        ".social-metrics",
        el("section.holders", el("span.value", "0"), el("span", " Holders")),
        el(
          "section.following",
          el("span.value", "0"),
          el("span", " Following"),
        ),
        el(
          "section.followers",
          el("span.value", "0"),
          el("span", " Followers"),
        ),
      ),
    );
  }
}
