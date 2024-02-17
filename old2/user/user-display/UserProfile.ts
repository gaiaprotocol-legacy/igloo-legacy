import { DomNode, el } from "@common-module/app";
import { ethers } from "ethers";
import MaterialIcon from "../../MaterialIcon.js";
import Subject from "../../database-interface/Subject.js";

export interface UserProfileData {
  profile_image?: string;
  display_name?: string;
  x_username?: string;
  total_earned_trading_fees: string;
}

export default class UserProfile extends DomNode {
  // Profile
  private profileImage: DomNode;
  private nameDisplay: DomNode;
  private xUsernameDisplay: DomNode;
  private socials: DomNode;

  // Trading Metrics
  private volumeDisplay: DomNode;
  private feesEarnedDisplay: DomNode;
  private portfolioValueDisplay: DomNode;
  private priceDisplay: DomNode;

  constructor(
    user: UserProfileData,
    subject: Subject | undefined,
    keyHoldingCount: number,
    portfolioValue: bigint,
    loading: boolean,
  ) {
    super(".user-profile");
    this.append(
      el(
        "section.profile",
        el(
          ".profile-image-wrapper",
          this.profileImage = el(".profile-image", {
            style: {
              backgroundImage: `url(${
                user.profile_image?.replace("_normal", "")
              })`,
            },
          }),
        ),
        this.nameDisplay = el("h2", loading ? "..." : user.display_name),
        el(
          "h3",
          this.xUsernameDisplay = el(
            "a",
            loading ? "..." : `@${user.x_username}`,
            loading ? {} : {
              href: `https://x.com/${user.x_username}`,
              target: "_blank",
            },
          ),
        ),
        this.socials = el(
          ".socials",
          ...(loading ? [] : [el(
            "a",
            el("img.x-symbol", { src: "/images/x-symbol.svg" }),
            {
              href: `https://x.com/${user.x_username}`,
              target: "_blank",
            },
          )]),
        ),
      ),
      el(
        "section.trading-metrics",
        el(
          "section.trading-volume",
          el(".icon-container", new MaterialIcon("analytics")),
          el(
            ".metric",
            el("h3", "Volume"),
            this.volumeDisplay = el(
              ".value",
              subject
                ? ethers.formatEther(subject.total_trading_key_volume)
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
            this.feesEarnedDisplay = el(
              ".value",
              user ? ethers.formatEther(user.total_earned_trading_fees) : "0",
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
              this.portfolioValueDisplay = el(
                "span",
                loading ? "..." : ethers.formatEther(portfolioValue),
              ),
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
            this.priceDisplay = el(
              ".value",
              subject
                ? ethers.formatEther(subject.last_fetched_key_price)
                : "0",
              el("img.avax-symbol", { src: "/images/avax-symbol.svg" }),
            ),
          ),
        ),
      ),
      el("section.actions"),
      el("section.social-metrics"),
    );
    if (loading) this.addClass("loading");
  }

  public update(
    user: UserProfileData,
    subject: Subject | undefined,
    keyHoldingCount: number,
    portfolioValue: bigint,
  ) {
    this.deleteClass("loading");
  }
}
