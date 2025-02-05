import {
  Confirm,
  DomNode,
  el,
  ErrorAlert,
  Router,
} from "@common-module/app";
import { ethers } from "ethers";
import { SocialUserPublic } from "@common-module/social";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import MaterialIcon from "../MaterialIcon.js";
import BuySubjectKeyPopup from "../subject/BuySubjectKeyPopup.js";
import SubjectKeyBalanceCacher from "../subject/SubjectKeyBalanceCacher.js";
import SubjectKeyService from "../subject/SubjectKeyService.js";
import TradeSubjectKeyPopup from "../subject/TradeSubjectKeyPopup.js";
import FollowManager from "./FollowManager.js";
import SignedUserManager from "./SignedUserManager.js";

export default class UserProfileDisplay extends DomNode {
  private settingsButton: DomNode;
  private followButton: DomNode;
  private portfolioValue: DomNode;

  constructor(
    private userDetails: SocialUserPublic,
    subjectDetails: SubjectDetails | undefined,
    holdingCount: number,
  ) {
    super(".user-profile-display");
    this.addAllowedEvents("trade-key");
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
              subjectDetails
                ? ethers.formatEther(subjectDetails.total_trading_key_volume)
                : "0",
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
              userDetails
                ? ethers.formatEther(userDetails.total_earned_trading_fees)
                : "0",
              el("img.avax-symbol", { src: "/images/avax-symbol.svg" }),
            ),
          ),
        ),
        el(
          "section.portfolio-value",
          el(".icon-container", new MaterialIcon("account_balance")),
          el(
            ".metric",
            el("h3", "Portfolio Value"),
            el(
              ".value",
              this.portfolioValue = el("span", "..."),
              el("img.avax-symbol", { src: "/images/avax-symbol.svg" }),
            ),
          ),
        ),
        el(
          "section.price",
          el(".icon-container", new MaterialIcon("sell")),
          el(
            ".metric",
            el("h3", "Price"),
            el(
              ".value",
              subjectDetails
                ? ethers.formatEther(subjectDetails.last_fetched_key_price)
                : "0",
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
          "Buy Ice",
          {
            click: () => {
              if (!SignedUserManager.userId) {
                new Confirm({
                  title: "Login Required",
                  message: "You must be logged in to buy ices.",
                  confirmTitle: "Login",
                }, () => SignedUserManager.signIn());
              } else if (!SignedUserManager.walletLinked) {
                new Confirm({
                  title: "Wallet Required",
                  message: "You must link a wallet to buy ices.",
                  confirmTitle: "Link Wallet",
                }, () => SignedUserManager.linkWallet());
              } else if (!userDetails.wallet_address) {
                new ErrorAlert({
                  title: "No wallet address",
                  message: "This user has not linked a wallet.",
                });
              } else {
                new BuySubjectKeyPopup(
                  userDetails,
                  () => this.fireEvent("trade-key"),
                );
              }
            },
          },
        ),
        el(
          "button.trade-key" + (!userDetails.wallet_address ? ".disabled" : ""),
          "Trade Ice",
          {
            click: () => {
              if (!SignedUserManager.userId) {
                new Confirm({
                  title: "Login Required",
                  message: "You must be logged in to buy ices.",
                  confirmTitle: "Login",
                }, () => SignedUserManager.signIn());
              } else if (!SignedUserManager.walletLinked) {
                new Confirm({
                  title: "Wallet Required",
                  message: "You must link a wallet to buy ices.",
                  confirmTitle: "Link Wallet",
                }, () => SignedUserManager.linkWallet());
              } else if (!userDetails.wallet_address) {
                new ErrorAlert({
                  title: "No wallet address",
                  message: "This user has not linked a wallet.",
                });
              } else {
                new TradeSubjectKeyPopup(
                  userDetails,
                  () => this.fireEvent("trade-key"),
                );
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
          "section.holdings",
          el(
            "a",
            el("span.value", String(holdingCount)),
            el("span", "Holdings"),
            { click: () => Router.go(`/${userDetails.x_username}/holdings`) },
          ),
        ),
        el(
          "section.holders",
          el(
            "a",
            el(
              "span.value",
              subjectDetails ? String(subjectDetails.key_holder_count) : "0",
            ),
            el("span", "Holders"),
            { click: () => Router.go(`/${userDetails.x_username}/holders`) },
          ),
        ),
        el(
          "section.following",
          el(
            "a",
            el("span.value", String(userDetails.following_count)),
            el("span", "Following"),
            { click: () => Router.go(`/${userDetails.x_username}/following`) },
          ),
        ),
        el(
          "section.followers",
          el(
            "a",
            el("span.value", String(userDetails.follower_count)),
            el("span", "Followers"),
            { click: () => Router.go(`/${userDetails.x_username}/followers`) },
          ),
        ),
      ),
    );

    this.checkSignedUser();
    this.onDelegate(
      SignedUserManager,
      "userFetched",
      () => {
        this.checkSignedUser();
        this.checkHolder();
      },
    );

    this.checkFollowing();
    this.onDelegate(FollowManager, ["follow", "unfollow"], (userId) => {
      if (userId === userDetails.user_id) {
        this.checkFollowing();
      }
    });

    this.checkHolder();
    this.onDelegate(SubjectKeyBalanceCacher, "update", (data) => {
      if (
        data.subject === userDetails.wallet_address &&
        data.walletAddress === SignedUserManager.walletAddress
      ) {
        this.checkHolder();
      }
    });

    this.fetchPortfolioValue();
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

  private checkHolder() {
    if (this.userDetails.wallet_address && SignedUserManager.walletAddress) {
      const balance = SubjectKeyBalanceCacher.getAndRefresh(
        this.userDetails.wallet_address,
        SignedUserManager.walletAddress,
      );
      balance > 0 ? this.addClass("holder") : this.deleteClass("holder");
    }
  }

  private async fetchPortfolioValue() {
    let portfolioValue = 0n;
    if (this.userDetails.wallet_address) {
      portfolioValue = await SubjectKeyService.fetchPortfolioValue(
        this.userDetails.wallet_address,
      );
    }
    if (!this.deleted) {
      this.portfolioValue.text = ethers.formatEther(portfolioValue);
    }
  }
}
