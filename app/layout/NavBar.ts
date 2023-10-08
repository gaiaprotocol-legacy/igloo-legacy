import { DomNode, el, MaterialIcon, Router } from "common-dapp-module";
import SignedUserManager from "../user/SignedUserManager.js";

export default class NavBar extends DomNode {
  private loginButton: DomNode;
  private signedUser: DomNode;

  constructor() {
    super(".nav-bar");
    this.append(
      el("h1", el("img", { src: "/images/logo.png" }), {
        click: () => Router.go("/"),
      }),
      el("button", new MaterialIcon("home"), {
        click: () => Router.go("/"),
      }),
      el("button", new MaterialIcon("inbox"), {
        click: () => Router.go("/inbox"),
      }),
      el("button", new MaterialIcon("search"), {
        click: () => Router.go("/explore"),
      }),
      el("button", new MaterialIcon("notifications"), {
        click: () => Router.go("/notifications"),
      }),
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
}
