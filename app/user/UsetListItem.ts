import { DomNode, el, MaterialIcon, Router } from "common-dapp-module";
import { ethers } from "ethers";
import UserDetails from "../database-interface/UserDetails.js";
import SubjectDetailsCacher from "../subject/SubjectDetailsCacher.js";
import UserDetailsCacher from "./UserDetailsCacher.js";

export default class UserListItem extends DomNode {
  constructor(private userDetails: UserDetails) {
    super(".user-list-item");

    this.render();
    this.onDelegate(UserDetailsCacher, "update", (userDetails: UserDetails) => {
      if (userDetails.user_id === this.userDetails.user_id) {
        this.userDetails = userDetails;
        this.render();
      }
    });

    this.onDom("click", () => Router.go(`/${this.userDetails.x_username}`));
  }

  private render() {
    const subjectDetails = this.userDetails.wallet_address
      ? SubjectDetailsCacher.get(this.userDetails.wallet_address)
      : undefined;

    this.empty().append(
      el(
        ".info-container",
        el(".profile-image", {
          style: { backgroundImage: `url(${this.userDetails.profile_image})` },
        }),
        el(
          ".info",
          el(".name", this.userDetails.display_name),
          this.userDetails.x_username
            ? el(".x-username", `@${this.userDetails.x_username}`)
            : undefined,
        ),
      ),
      el(
        ".metric-container",
        el(
          "section.price",
          el(".icon-container", new MaterialIcon("group")),
          el(
            ".metric",
            el("h3", "Holders"),
            el(
              ".value",
              subjectDetails ? String(subjectDetails.key_holder_count) : "0",
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
    );
  }
}
