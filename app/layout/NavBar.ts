import { DomNode, el, Router } from "common-app-module";
import MaterialIcon from "../MaterialIcon.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";

export default class NavBar extends DomNode {
  private activatedButton: DomNode | undefined;

  constructor() {
    super(".nav-bar");
    this.append(
      el("h1", el("img", { src: "/images/logo.png" }), {
        click: () => Router.go("/"),
      }),
      el("button.home", new MaterialIcon("home"), {
        click: () => Router.go("/"),
      }),
      el("button.chats", new MaterialIcon("chat"), {
        click: () => Router.go("/chats"),
      }),
      el("button.explore", new MaterialIcon("search"), {
        click: () => Router.go("/explore"),
      }),
      el("button.notifications", new MaterialIcon("notifications"), {
        click: () => Router.go("/notifications"),
      }),
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

  public activeButton(buttonName: string) {
    this.activatedButton?.deleteClass("active");
    this.activatedButton = this.children.find((child) =>
      child.hasClass(buttonName)
    )?.addClass("active");
  }
}
