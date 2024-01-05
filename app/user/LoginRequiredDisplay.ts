import { DomNode, el, msg } from "@common-module/app";
import IglooSignedUserManager from "./IglooSignedUserManager.js";

export default class LoginRequiredDisplay extends DomNode {
  constructor() {
    super(".login-required");
    this.append(
      el("p", msg("login-required-message")),
      el("button", msg("login-required-login-button"), {
        click: () => IglooSignedUserManager.signIn(),
      }),
    );
  }
}
