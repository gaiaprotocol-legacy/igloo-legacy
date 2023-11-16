import { DomNode, el, View, ViewParams } from "common-app-module";
import PreviewUserPublic from "../database-interface/PreviewUserPublic.js";
import Layout from "../layout/Layout.js";
import MaterialIcon from "../MaterialIcon.js";
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
    let userPublic = IglooUserCacher.getByXUsername(xUsername);

    let userDisplay;
    this.userDisplayContainer.empty().append(
      userDisplay = new UserDisplay(userPublic, previewUserPublic),
    );

    userPublic = await IglooUserService.fetchByXUsername(xUsername);
    if (userPublic) {
      IglooUserCacher.cache(userPublic);
      if (!userDisplay.deleted) userDisplay.update(userPublic);
    }
  }
}
