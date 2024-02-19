import { el, View, ViewParams, WarningMessageBox } from "@common-module/app";
import { HESFLayout } from "hesf";

export default class AboutView extends View {
  constructor(params: ViewParams, uri: string) {
    super();
    HESFLayout.append(
      this.container = el(
        ".about-view",
        new WarningMessageBox({
          message: [
            "Igloo is currently operating on the Avalanche Fuji Testnet. It is planned to launch on the mainnet in alignment with the release of the Sonic mainnet.",
          ],
        }),
        el(
          "section",
          el("h2", "Introduction to Igloo"),
          el(
            "p",
            el("img", {
              src: "/images/logo-transparent.png",
              alt: "Igloo Logo",
            }),
            "Igloo is a new Social Fi service built on the Avalanche blockchain. It allows users to engage with communities through ",
            el("b", "ices"),
            " 🧊, which are social tokens that can be bought or sold.",
          ),
        ),
        el(
          "section",
          el("h2", "Understanding Full-stack Social Fi"),
          el(
            "p",
            "Full-stack Social Fi represents an expansion from personal-focused social finance to include groups. In Igloo, users can buy ices to participate in and communicate with communities centered around individuals, groups, or subjects.",
          ),
        ),
        el(
          "section",
          el("h2", "Monetization in Igloo"),
          el(
            "p",
            "Regarding monetization, users can generate revenue through Igloo. For individual ices, the ice owner earns ",
            el("b", "5%"),
            " of the transaction amount as profit. For group ices, holders receive ",
            el("b", "5%"),
            " of the transaction volume, distributed proportionally to their holdings.",
          ),
        ),
      ),
    );
  }
}
