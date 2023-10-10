import { DomNode, el, View, ViewParams } from "common-dapp-module";
import Layout from "../layout/Layout.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class SettingsView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".settings-view",
        el("h1", "Settings"),
        el(
          "main",
          el("section.x" //TODO:
          ),
          el(
            "section.actions",
            SignedUserManager.signed
              ? el(
                "section.connect-wallet",
                el("h2", "Connect Wallet"),
                SignedUserManager.walletConnected
                  ? el(
                    "p",
                    "Connected: ",
                    el("a", SignedUserManager.walletAddress, {
                      href:
                        `https://snowtrace.io/address/${SignedUserManager.walletAddress}`,
                      target: "_blank",
                    }),
                  )
                  : el("p", "You can connect your wallet to use Igloo."),
                el("button", "Connect Wallet", {
                  click: () => SignedUserManager.connectWallet(),
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
                el("h2", "Log In"),
                el("p", "You can log in to this device."),
                el("button", "Log In", {
                  click: () => SignedUserManager.signIn(),
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
