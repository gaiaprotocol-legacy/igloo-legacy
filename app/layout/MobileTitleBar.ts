import { DomNode, el, MaterialIcon, Router } from "common-dapp-module";
import SignedUserManager from "../user/SignedUserManager.js";

export default class MobileTitleBar extends DomNode {
  private welcomeMessage: string = "Welcome to Igloo!";

  private titleDisplay: DomNode;
  private loginButton: DomNode;
  private signedUser: DomNode;

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
    );

    this.checkSigned();
    this.onDelegate(SignedUserManager, "userFetched", () => this.checkSigned());
  }

  private checkSigned() {
    !SignedUserManager.signed ? this.showLoginButton() : this.showSignedUser();
    this.title = this.welcomeMessage = SignedUserManager.signed
      ? "Hello, " + SignedUserManager.name + "!"
      : "Welcome to Igloo!";
    if (SignedUserManager.signed) {
      this.signedUser.style({
        backgroundImage: `url(${SignedUserManager.avatarUrl})`,
      });
    }
  }

  private showLoginButton() {
    this.loginButton.addClass("show");
    this.signedUser.deleteClass("show");
  }

  private showSignedUser() {
    this.loginButton.deleteClass("show");
    this.signedUser.addClass("show");
  }

  public set title(title: string) {
    this.titleDisplay.text = title === "Home" ? this.welcomeMessage : title;
  }
}
