import { DomNode, el } from "common-dapp-module";
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
            style: { backgroundImage: `url(${userDetails.profile_image})` },
          }),
        ),
        el("h2", userDetails.display_name),
        el(
          "h3",
          el(
            "a",
            "@" + userDetails.x_username,
            el("img.x-symbol", { src: "/images/x-symbol.svg" }),
            {
              href: `https://x.com/${userDetails.x_username}`,
              target: "_blank",
            },
          ),
        ),
      ),
    );
  }
}
