import { el, msg, Router, View, ViewParams } from "common-app-module";
import Layout from "../layout/Layout.js";

export default class ProfileView extends View {
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
      ),
    );
  }
}
