import { DomNode, el, msg, Router, StringUtil } from "@common-module/app";
import MaterialIcon from "../MaterialIcon.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";

export default class MobileTitleBar extends DomNode {
  private welcomeMessage: string;

  private logo: DomNode;
  private backButton: DomNode;
  private titleDisplay: DomNode;

  constructor() {
    super(".mobile-title-bar");

    this.welcomeMessage = IglooSignedUserManager.signed
      ? msg("mobile-title-bar-welcome-message-signed-in", {
        name: IglooSignedUserManager.user?.display_name,
      })
      : msg("mobile-title-bar-welcome-message-not-signed-in");

    this.append(
      this.logo = el("h1", el("img", { src: "/images/logo-top.png" }), {
        click: () => Router.go("/"),
      }),
      this.backButton = el("button.back", new MaterialIcon("arrow_back"), {
        click: () => history.back(),
      }),
      this.titleDisplay = el("p", this.welcomeMessage),
      !IglooSignedUserManager.signed
        ? el("button.login", new MaterialIcon("login"), {
          click: () => IglooSignedUserManager.signIn(),
        })
        : el("a.signed-user", {
          style: {
            backgroundImage:
              `url(${IglooSignedUserManager.user?.profile_image_thumbnail})`,
          },
          click: () => Router.go("/profile"),
        }),
    );
  }

  private showLogo() {
    this.logo.deleteClass("hidden");
    this.backButton.addClass("hidden");
  }

  private showBackButton() {
    this.logo.addClass("hidden");
    this.backButton.deleteClass("hidden");
  }

  public changeTitle(uri: string) {
    if (
      uri === "" || uri === "chats" || uri.startsWith("chats/") ||
      uri === "explore" || uri === "search" || uri === "notifications" ||
      uri === "profile" || uri === "settings"
    ) {
      this.titleDisplay.text = uri === ""
        ? this.welcomeMessage
        : StringUtil.toTitleCase(uri);
      this.showLogo();
    } else if (uri.startsWith("post/")) {
      this.titleDisplay.text = "Post";
      this.showBackButton();
    } else { // x username
      const xUsername = uri.split("/")[0];
      const path = uri.split("/")[1];
      this.titleDisplay.text = "@" + xUsername +
        (path ? "'s " + StringUtil.toTitleCase(path) : "");
      this.showBackButton();
    }
  }
}
