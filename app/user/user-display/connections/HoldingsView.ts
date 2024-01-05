import { el, ListLoadingBar, msg, View, ViewParams } from "@common-module/app";
import Layout from "../../../layout/Layout.js";
import MaterialIcon from "../../../MaterialIcon.js";
import IglooUserCacher from "../../IglooUserCacher.js";
import IglooUserService from "../../IglooUserService.js";
import HoldingList from "./HoldingList.js";

export default class HoldingsView extends View {
  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".holdings-view",
      ),
    );
    this.render(params.xUsername!);
  }

  public changeParams(params: ViewParams): void {
    this.render(params.xUsername!);
  }

  private async render(xUsername: string) {
    const walletAddress = IglooUserCacher.getByXUsername(xUsername)
      ?.wallet_address;

    let listContainer;
    this.container.empty().append(
      el(
        "header",
        el("button", new MaterialIcon("arrow_back"), {
          click: () => history.back(),
        }),
        el("h1", `@${xUsername}`),
      ),
      listContainer = el(
        "main",
        walletAddress ? new HoldingList(walletAddress) : new ListLoadingBar(),
      ),
    );

    if (!walletAddress) {
      const user = await IglooUserService.fetchByXUsername(xUsername);
      if (!user) {
        listContainer.empty().append(
          el("p.error", msg("user-not-found-message")),
        );
      } else {
        IglooUserCacher.cache(user);
        listContainer.empty();
        if (user.wallet_address) {
          listContainer.append(new HoldingList(user.wallet_address));
        }
      }
    }
  }
}
