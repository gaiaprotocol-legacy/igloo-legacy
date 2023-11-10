import { DomNode, el, Router } from "common-app-module";
import MaterialIcon from "../MaterialIcon.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class NavBar extends DomNode {
  constructor() {
    super(".nav-bar");
    this.append(
      !SignedUserManager.signed
        ? el("button.login", new MaterialIcon("login"), {
          click: () => SignedUserManager.signIn(),
        })
        : el("a.signed-user", {
          style: {
            backgroundImage:
              `url(${SignedUserManager.user?.profile_image_thumbnail})`,
          },
          click: () => Router.go(`/${SignedUserManager.user?.x_username}`),
        }),
    );
  }

  public activeButton(buttonName: string) {
    //TODO:
  }
}
