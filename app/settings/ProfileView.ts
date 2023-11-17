import {
  DomNode,
  el,
  ListLoadingBar,
  msg,
  Router,
  View,
  ViewParams,
} from "common-app-module";
import Layout from "../layout/Layout.js";
import SubjectService from "../subject/SubjectService.js";
import TempSubjectCacher from "../subject/TempSubjectCacher.js";
import IglooUserCacher from "../user/IglooUserCacher.js";
import IglooUserService from "../user/IglooUserService.js";
import SignedUserManager from "../user/SignedUserManager.js";
import UserDisplay from "../user/UserDisplay.js";

export default class ProfileView extends View {
  private userDisplayContainer: DomNode;
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
        this.userDisplayContainer = el("main"),
      ),
    );
    this.load();
  }

  private async load() {
    let subject = SignedUserManager.user?.wallet_address
      ? TempSubjectCacher.get(SignedUserManager.user.wallet_address)
      : undefined;
    let keyHoldingCount = SignedUserManager.user
      ? IglooUserCacher.getKeyHoldingCount(SignedUserManager.user.user_id) ?? 0
      : 0;
    let portfolioValue = SignedUserManager.user
      ? IglooUserCacher.getPortfolioValue(SignedUserManager.user.user_id) ?? 0n
      : 0n;

    const userDisplay = new UserDisplay(
      SignedUserManager.user,
      subject,
      keyHoldingCount,
      portfolioValue,
    ).appendTo(
      this.userDisplayContainer,
    );

    const loading = new ListLoadingBar().appendTo(this.userDisplayContainer);

    if (SignedUserManager.user) {
      const userPublic = await IglooUserService.fetchUser(
        SignedUserManager.user.user_id,
      );
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
}
