import { el, ListLoadingBar, msg, View, ViewParams } from "common-app-module";
import Layout from "../../../layout/Layout.js";
import MaterialIcon from "../../../MaterialIcon.js";
import IglooUserCacher from "../../IglooUserCacher.js";
import IglooUserService from "../../IglooUserService.js";
import HolderList from "./HolderList.js";

export default class HoldersView extends View {
  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".holders-view",
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
        walletAddress ? new HolderList(walletAddress) : new ListLoadingBar(),
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
          listContainer.append(new HolderList(user.wallet_address));
        }
      }
    }
  }
}
