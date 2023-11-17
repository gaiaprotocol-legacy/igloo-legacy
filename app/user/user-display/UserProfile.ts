import { DomNode, el } from "common-app-module";

export default class UserProfile extends DomNode {
  private profileImage: DomNode;
  private nameDisplay: DomNode;
  private xUsernameDisplay: DomNode;
  private socials: DomNode;

  constructor(
    user: {
      profile_image?: string;
      display_name?: string;
      x_username?: string;
    },
    loading?: boolean,
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
      el("section.trading-metrics"),
      el("section.actions"),
      el("section.social-metrics"),
    );
    if (loading) this.addClass("loading");
  }

  public update() {
    this.deleteClass("loading");
  }
}
