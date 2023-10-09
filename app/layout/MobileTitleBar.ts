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

  private titleDisplay: DomNode;
  private loginButton: DomNode;
  private signedUser: DomNode;
  private settingsButton: DomNode;

  constructor() {
    super(".mobile-title-bar");
    this.append(
      el("h1", el("img", { src: "/images/logo.png" }), {
        click: () => Router.go("/"),
      }),
      this.titleDisplay = el("p"),
      this.loginButton = el("button.login-button", new MaterialIcon("login"), {
        click: () => SignedUserManager.signIn(),
      }),
      this.signedUser = el("a.signed-user", {
        click: () => Router.go(`/${SignedUserManager.xUsername}`),
      }),
      this.settingsButton = el(
        "button.settings-button",
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

  private showLoginOrSignedUser() {
    !SignedUserManager.signed ? this.showLoginButton() : this.showSignedUser();
  }

  private showLoginButton() {
    this.loginButton.addClass("show");
    this.signedUser.deleteClass("show");
    this.settingsButton.deleteClass("show");
  }

  private showSignedUser() {
    this.loginButton.deleteClass("show");
    this.signedUser.addClass("show");
    this.settingsButton.deleteClass("show");
  }

  private showSettingsButton() {
    this.loginButton.deleteClass("show");
    this.signedUser.deleteClass("show");
    this.settingsButton.addClass("show");
  }

  public set uri(uri: string) {
    if (
      uri === "" || uri === "inbox" || uri === "explore" ||
      uri === "notifications" || uri === "settings"
    ) {
      this.titleDisplay.text = uri === ""
        ? this.welcomeMessage
        : StringUtil.toTitleCase(uri);
      this.showLoginOrSignedUser();
    } else { // x username
      this.titleDisplay.text = "@" + uri;
      if (SignedUserManager.xUsername === uri) {
        this.showSettingsButton();
      } else {
        this.showLoginOrSignedUser();
      }
    }
  }
}
