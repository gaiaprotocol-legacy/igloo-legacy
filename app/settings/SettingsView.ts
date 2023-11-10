import { DomNode, el, msg, View, ViewParams } from "common-app-module";
import Layout from "../layout/Layout.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class SettingsView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".settings-view",
        el("h1", msg("settings-view-title")),
        el(
          "main",
          el("section.x"),
          el(
            "section.actions",
            !SignedUserManager.signed
              ? el(
                "section.login",
                el("h2", msg("settings-view-login-section-title")),
                el("p", msg("settings-view-login-section-description")),
                el("button", msg("settings-view-login-button"), {
                  click: () => SignedUserManager.signIn(),
                }),
              )
              : el(
                "section.logout",
                el("h2", msg("settings-view-logout-section-title")),
                el("p", msg("settings-view-logout-section-description")),
                el("button", msg("settings-view-logout-button"), {
                  click: () => SignedUserManager.signOut(),
                }),
              ),
          ),
        ),
      ),
    );
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
