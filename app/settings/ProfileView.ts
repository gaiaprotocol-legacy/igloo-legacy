import { DomNode, el, msg, Router, View, ViewParams } from "common-app-module";
import Layout from "../layout/Layout.js";
import IglooUserCacher from "../user/IglooUserCacher.js";
import IglooUserService from "../user/IglooUserService.js";
import SignedUserManager from "../user/SignedUserManager.js";
import UserDisplay from "../user/UserDisplay.js";

export default class ProfileView extends View {
  private userDisplayContainer: DomNode;
  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".profile-view",
        el("h1", msg("profile-view-title")),
        el(
          ".tabs.component",
          el("a.tab.active", "Profile"),
          el("a.tab", "Settings", {
            click: () => Router.go("/settings"),
          }),
        ),
        this.userDisplayContainer = el("main"),
      ),
    );
    this.load();
  }

  private async load() {
    const userDisplay = new UserDisplay(SignedUserManager.user).appendTo(
      this.userDisplayContainer,
    );
    if (SignedUserManager.user) {
      const userPublic = await IglooUserService.fetchUser(
        SignedUserManager.user.user_id,
      );
      if (userPublic) {
        IglooUserCacher.cache(userPublic);
        if (!userDisplay.deleted) userDisplay.update(userPublic);
      }
    }
  }
}
