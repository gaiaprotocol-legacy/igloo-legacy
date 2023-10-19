import {
  DomNode,
  el,
  MaterialIcon,
  Router,
  StringUtil,
} from "common-dapp-module";
import SignedUserManager from "../user/SignedUserManager.js";

export default class MobileTitleBar extends DomNode {
  private welcomeMessage: string = "Welcome to Igloo!";

  private logo: DomNode;
  private backButton: DomNode;
  private titleDisplay: DomNode;
  private loginButton: DomNode;
  private signedUser: DomNode;
  private settingsButton: DomNode;

  constructor() {
    super(".mobile-title-bar");
    this.append(
      this.logo = el("h1", el("img", { src: "/images/logo.png" }), {
        click: () => Router.go("/"),
      }),
      this.backButton = el("button.back", new MaterialIcon("arrow_back"), {
        click: () => history.back(),
      }),
      this.titleDisplay = el("p"),
      this.loginButton = el("button.login", new MaterialIcon("login"), {
        click: () => SignedUserManager.signIn(),
      }),
      this.signedUser = el("a.signed-user", {
        click: () => Router.go(`/${SignedUserManager.xUsername}`),
      }),
      this.settingsButton = el(
        "button.settings",
        new MaterialIcon("settings"),
        { click: () => Router.go("/settings") },
      ),
    );

    this.checkSigned();
    this.onDelegate(SignedUserManager, "userFetched", () => this.checkSigned());
  }

  private checkSigned() {
    this.showLoginOrSignedUser();
    this.titleDisplay.text = this.welcomeMessage = SignedUserManager.signed
      ? "Hello, " + SignedUserManager.name + "!"
      : "Welcome to Igloo!";
    if (SignedUserManager.signed) {
      this.signedUser.style({
        backgroundImage: `url(${SignedUserManager.avatarUrl})`,
      });
    }
  }

  private showLogo() {
    this.logo.deleteClass("hidden");
    this.backButton.addClass("hidden");
  }

  private showBackButton() {
    this.logo.addClass("hidden");
    this.backButton.deleteClass("hidden");
  }

  private hideAllButtons() {
    [this.loginButton, this.signedUser, this.settingsButton]
      .forEach((button) => button.addClass("hidden"));
  }

  private showLoginOrSignedUser() {
    !SignedUserManager.signed ? this.showLoginButton() : this.showSignedUser();
  }

  private showLoginButton() {
    this.hideAllButtons();
    this.loginButton.deleteClass("hidden");
  }

  private showSignedUser() {
    this.hideAllButtons();
    this.signedUser.deleteClass("hidden");
  }

  private showSettingsButton() {
    this.hideAllButtons();
    this.settingsButton.deleteClass("hidden");
  }

  public set uri(uri: string) {
    if (
      uri === "" || uri === "chats" || uri.startsWith("chats/") ||
      uri === "explore" || uri === "notifications" || uri === "settings"
    ) {
      this.titleDisplay.text = uri === ""
        ? this.welcomeMessage
        : StringUtil.toTitleCase(uri);
      this.showLogo();
      this.showLoginOrSignedUser();
    } else if (uri.startsWith("post/")) {
      this.titleDisplay.text = "Post";
      this.showBackButton();
      this.showLoginOrSignedUser();
    } else { // x username
      this.titleDisplay.text = "@" + uri;
      this.showBackButton();
      if (SignedUserManager.xUsername === uri) {
        this.showSettingsButton();
      } else {
        this.showLoginOrSignedUser();
      }
    }
  }
}
