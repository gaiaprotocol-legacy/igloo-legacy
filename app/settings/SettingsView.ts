import { DomNode, el, msg, Router, Switch, View, ViewParams } from "common-app-module";
import Layout from "../layout/Layout.js";
import ThemeManager from "../ThemeManager.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
import LinkWalletPopup from "../wallet/LinkWalletPopup.js";

export default class SettingsView extends View {
  private darkModeSwitch: Switch;
  private linkWalletSection: DomNode | undefined;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".settings-view",
        el("h1", msg("settings-view-title")),
        el(
          ".tabs.component",
          el("a.tab", "Profile", {
            click: () => Router.go("/profile"),
          }),
          el("a.tab.active", "Settings"),
        ),
        el(
          "main",
          el(
            "section.x",
            el("h2", msg("settings-view-x-section-title")),
            el(
              ".profile-image-wrapper",
              el(".profile-image", {
                style: { backgroundImage: "url(/images/icon-512x512.png)" },
              }),
            ),
            el(
              "h3",
              el(
                "a",
                "@iglooax",
                {
                  href: "https://x.com/iglooax",
                  target: "_blank",
                },
              ),
            ),
            el(
              ".socials",
              el(
                "a",
                el("img.x-symbol", { src: "/images/x-symbol.svg" }),
                {
                  href: "https://x.com/iglooax",
                  target: "_blank",
                },
              ),
            ),
          ),
          el(
            "section.actions",
            el(
              "section.dark-mode",
              el("h2", msg("settings-view-dark-mode-section-title")),
              el("p", msg("settings-view-dark-mode-section-description")),
              this.darkModeSwitch = new Switch(ThemeManager.darkMode),
            ),
            !IglooSignedUserManager.signed
              ? undefined
              : this.linkWalletSection = el("section.link-wallet"),
            !IglooSignedUserManager.signed
              ? el(
                "section.login",
                el("h2", msg("settings-view-login-section-title")),
                el("p", msg("settings-view-login-section-description")),
                el("button", msg("settings-view-login-button"), {
                  click: () => IglooSignedUserManager.signIn(),
                }),
              )
              : el(
                "section.logout",
                el("h2", msg("settings-view-logout-section-title")),
                el("p", msg("settings-view-logout-section-description")),
                el("button", msg("settings-view-logout-button"), {
                  click: () => IglooSignedUserManager.signOut(),
                }),
              ),
          ),
        ),
      ),
    );

    this.darkModeSwitch.on(
      "change",
      (checked: boolean) => ThemeManager.darkMode = checked,
    );

    this.renderLinkWalletSection();
    this.container.onDelegate(
      IglooSignedUserManager,
      "walletLinked",
      () => this.renderLinkWalletSection(),
    );
  }

  private renderLinkWalletSection() {
    this.linkWalletSection?.empty().append(
      el("h2", msg("settings-view-link-wallet-section-title")),
      IglooSignedUserManager.walletLinked
        ? el(
          "p.linked",
          msg("settings-view-link-wallet-section-linked") + " ",
          el("a", IglooSignedUserManager.user?.wallet_address, {
            href:
              `https://snowtrace.io/address/${IglooSignedUserManager.user?.wallet_address}`,
            target: "_blank",
          }),
        )
        : el("p", msg("settings-view-link-wallet-section-description")),
      el("button", msg("settings-view-link-wallet-button"), {
        click: () => new LinkWalletPopup(),
      }),
    );
  }
}
