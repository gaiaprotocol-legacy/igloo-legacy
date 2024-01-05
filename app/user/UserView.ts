import {
  DomNode,
  el,
  ListLoadingBar,
  msg,
  View,
  ViewParams,
} from "@common-module/app";
import { PreviewUserPublic } from "@common-module/social";
import Layout from "../layout/Layout.js";
import MaterialIcon from "../MaterialIcon.js";
import SubjectService from "../subject/SubjectService.js";
import TempSubjectCacher from "../subject/TempSubjectCacher.js";
import IglooUserCacher from "./IglooUserCacher.js";
import IglooUserService from "./IglooUserService.js";
import UserDisplay from "./UserDisplay.js";

export default class UserView extends View {
  private title: DomNode;
  private userDisplayContainer: DomNode;

  constructor(params: ViewParams, uri: string, data?: any) {
    super();
    Layout.append(
      this.container = el(
        ".user-view",
        el(
          "header",
          el("button", new MaterialIcon("arrow_back"), {
            click: () => history.back(),
          }),
          this.title = el("h1"),
        ),
        this.userDisplayContainer = el("main"),
      ),
    );
    this.render(params.xUsername!, data);
  }

  public changeParams(params: ViewParams, uri: string, data?: any): void {
    this.render(params.xUsername!, data);
  }

  private async render(
    xUsername: string,
    previewUserPublic?: PreviewUserPublic,
  ) {
    this.title.text = `@${xUsername}`;

    let userPublic = IglooUserCacher.getByXUsername(xUsername);
    let subject = userPublic?.wallet_address
      ? TempSubjectCacher.get(userPublic.wallet_address)
      : undefined;
    let keyHoldingCount = userPublic
      ? IglooUserCacher.getKeyHoldingCount(userPublic.user_id) ?? 0
      : 0;
    let portfolioValue = userPublic
      ? IglooUserCacher.getPortfolioValue(userPublic.user_id) ?? 0n
      : 0n;

    let userDisplay, loading;
    this.userDisplayContainer.empty().append(
      userDisplay = new UserDisplay(
        userPublic,
        subject,
        keyHoldingCount,
        portfolioValue,
        previewUserPublic,
      ),
      loading = new ListLoadingBar(),
    );

    userPublic = await IglooUserService.fetchByXUsername(xUsername);
    if (!userPublic) {
      this.userDisplayContainer.empty().append(
        el("p", msg("user-not-found-message")),
      );
    } else {
      IglooUserCacher.cache(userPublic);

      subject = userPublic.wallet_address
        ? await SubjectService.fetchSubject(userPublic.wallet_address)
        : undefined;

      if (userPublic.wallet_address) {
        const result = await IglooUserService.fetchPortfolioValue(
          userPublic.wallet_address,
        );
        keyHoldingCount = result.total_keys_count;
        portfolioValue = result.total_portfolio_value;
      }

      if (!userDisplay.deleted) {
        userDisplay.update(
          userPublic,
          subject,
          keyHoldingCount,
          portfolioValue,
        );
        loading.delete();
      }
    }
  }
}
