import { DomNode, el, View, ViewParams } from "common-dapp-module";
import Layout from "../layout/Layout.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class SettingsView extends View {
  private container: DomNode;

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
        el("section.x" //TODO:
        ),
        el(
          "section.actions",
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
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
