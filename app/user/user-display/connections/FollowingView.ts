import { el, ListLoadingBar, msg, View, ViewParams } from "common-app-module";
import Layout from "../../../layout/Layout.js";
import MaterialIcon from "../../../MaterialIcon.js";
import IglooUserCacher from "../../IglooUserCacher.js";
import IglooUserService from "../../IglooUserService.js";
import FollowingList from "./FollowingList.js";

export default class FollowingView extends View {
  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".following-view",
      ),
    );
    this.render(params.xUsername!);
  }

  public changeParams(params: ViewParams): void {
    this.render(params.xUsername!);
  }

  private async render(xUsername: string) {
    const cached = IglooUserCacher.getByXUsername(xUsername);

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
        cached ? new FollowingList(cached.user_id) : new ListLoadingBar(),
      ),
    );

    if (!cached) {
      const user = await IglooUserService.fetchByXUsername(xUsername);
      if (!user) {
        listContainer.empty().append(
          el("p.error", msg("user-not-found-message")),
        );
      } else {
        IglooUserCacher.cache(user);
        listContainer.empty().append(new FollowingList(user.user_id));
      }
    }
  }
}
