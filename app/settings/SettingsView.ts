import { DomNode, el, Switch, View, ViewParams } from "common-app-module";
import Layout from "../layout/Layout.js";
import SignedUserManager from "../user/SignedUserManager.js";
import ThemeManager from "../ThemeManager.js";

export default class SettingsView extends View {
  private container: DomNode;
  private darkModeSwitch!: Switch;

  constructor(params: ViewParams) {
    super();
    Layout.append(this.container = el(".settings-view"));

    this.render();
    this.container.onDelegate(
      SignedUserManager,
      "userFetched",
      () => this.render(),
    );
  }

  private render() {
    this.container.empty().append(
      el("h1", "Settings"),
      el(
        "main",
        el(
          "section.x",
          el("h2", "Igloo's 𝕏"),
          el(
            ".profile-image-wrapper",
            el(".profile-image", {
              style: {
                backgroundImage: "url(/images/icon-512x512.png)",
              },
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
            "section.dark-mode-setting",
            el("h2", "Dark Mode (Coming Soon)"),
            el("p", "You can toggle dark mode."),
            this.darkModeSwitch = new Switch(ThemeManager.darkMode),
          ),
          SignedUserManager.signed
            ? el(
              "section.link-wallet",
              el("h2", "Link Wallet"),
              SignedUserManager.walletLinked
                ? el(
                  "p.linked",
                  "Linked: ",
                  el("a", SignedUserManager.walletAddress, {
                    href:
                      `https://snowtrace.io/address/${SignedUserManager.walletAddress}`,
                    target: "_blank",
                  }),
                )
                : el("p", "You can link your wallet to use Igloo."),
              el("button", "Link Wallet", {
                click: () => SignedUserManager.linkWallet(),
              }),
            )
            : undefined,
          SignedUserManager.signed
            ? el(
              "section.logout",
              el("h2", "Log Out"),
              el("p", "You can log out from this device."),
              el("button", "Log Out", {
                click: () => SignedUserManager.signOut(),
              }),
            )
            : el(
              "section.login",
              el("h2", "Login"),
              el("p", "You can login to this device."),
              el("button", "Login with 𝕏", {
                click: () => SignedUserManager.signIn(),
              }),
            ),
        ),
      ),
    );

    this.darkModeSwitch.on("change", (checked: boolean) => {
      ThemeManager.darkMode = checked;
    });
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
