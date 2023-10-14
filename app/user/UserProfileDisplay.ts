import {
  Confirm,
  DomNode,
  el,
  ErrorAlert,
  MaterialIcon,
  Router,
} from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";
import BuySubjectKeyPopup from "../subject/BuySubjectKeyPopup.js";
import FollowManager from "./FollowManager.js";
import SignedUserManager from "./SignedUserManager.js";

export default class UserProfileDisplay extends DomNode {
  private settingsButton: DomNode;
  private followButton: DomNode;

  constructor(private userDetails: UserDetails) {
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
          el(
            ".metric",
            el("h3", "Volume"),
            el(
              ".value",
              "0.00",
              el("img.avax-symbol", { src: "/images/avax-symbol.svg" }),
            ),
          ),
        ),
        el(
          "section.earned",
          el(".icon-container", new MaterialIcon("savings")),
          el(
            ".metric",
            el("h3", "Fees Earned"),
            el(
              ".value",
              "0.00",
              el("img.avax-symbol", { src: "/images/avax-symbol.svg" }),
            ),
          ),
        ),
        el(
          "section.holdings",
          el(".icon-container", new MaterialIcon("account_balance_wallet")),
          el(".metric", el("h3", "Holdings"), el(".value", "0")),
        ),
        el(
          "section.price",
          el(".icon-container", new MaterialIcon("sell")),
          el(
            ".metric",
            el("h3", "Price"),
            el(
              ".value",
              "0.00",
              el("img.avax-symbol", { src: "/images/avax-symbol.svg" }),
            ),
          ),
        ),
      ),
      el(
        ".action-buttons",
        this.followButton = el("button.follow", "Follow", {
          click: () => {
            if (!SignedUserManager.userId) {
              new Confirm({
                title: "Login Required",
                message: "You must be logged in to follow users.",
                confirmTitle: "Login",
              }, () => SignedUserManager.signIn());
            } else {
              FollowManager.isFollowing(userDetails.user_id)
                ? FollowManager.unfollow(userDetails.user_id)
                : FollowManager.follow(userDetails.user_id);
            }
          },
        }),
        el(
          "button.buy-key" + (!userDetails.wallet_address ? ".disabled" : ""),
          "Buy Key",
          {
            click: () => {
              if (!SignedUserManager.userId) {
                new Confirm({
                  title: "Login Required",
                  message: "You must be logged in to buy keys.",
                  confirmTitle: "Login",
                }, () => SignedUserManager.signIn());
              } else if (!SignedUserManager.walletLinked) {
                new Confirm({
                  title: "Wallet Required",
                  message: "You must link a wallet to buy keys.",
                  confirmTitle: "Link Wallet",
                }, () => SignedUserManager.linkWallet());
              } else if (!userDetails.wallet_address) {
                new ErrorAlert({
                  title: "No wallet address",
                  message: "This user has not linked a wallet.",
                });
              } else {
                new BuySubjectKeyPopup(userDetails);
              }
            },
          },
        ),
        this.settingsButton = el(
          "button.settings",
          "Settings",
          { click: () => Router.go("/settings") },
        ),
      ),
      el(
        ".social-metrics",
        el(
          "section.holders",
          el("a", el("span.value", "1230"), el("span", " Holders")),
        ),
        el(
          "section.following",
          el("a", el("span.value", "1230"), el("span", " Following")),
        ),
        el(
          "section.followers",
          el("a", el("span.value", "1230"), el("span", " Followers")),
        ),
      ),
    );

    this.checkSignedUser();
    this.onDelegate(
      SignedUserManager,
      "userFetched",
      () => this.checkSignedUser(),
    );

    this.checkFollowing();
    this.onDelegate(FollowManager, ["follow", "unfollow"], (userId) => {
      if (userId === userDetails.user_id) {
        this.checkFollowing();
      }
    });
  }

  private checkSignedUser() {
    SignedUserManager.userId === this.userDetails.user_id
      ? this.followButton.addClass("hidden")
      : this.settingsButton.addClass("hidden");
  }

  private checkFollowing() {
    FollowManager.isFollowing(this.userDetails.user_id)
      ? this.followButton.text = "Unfollow"
      : this.followButton.text = "Follow";
  }
}
