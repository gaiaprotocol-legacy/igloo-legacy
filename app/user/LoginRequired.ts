import { DomNode, el } from "common-dapp-module";
import SignedUserManager from "./SignedUserManager.js";

export default class LoginRequired extends DomNode {
  constructor() {
    super(".login-required");
    this.append(
      el("p", "This page requires login. Would you like to login?"),
      el("button", "Login with 𝕏", {
        click: () => SignedUserManager.signIn(),
      }),
    );
  }
}
