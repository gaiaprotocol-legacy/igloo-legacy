import { DomNode, el } from "common-app-module";
import TopUserList from "../explore/TopUserList.js";

export default class TopUserSection extends DomNode {
  constructor() {
    super(".top-user-section");
    this.append(
      el("h2", "Top Users"),
      new TopUserList(),
    );
  }

  public hide() {
    this.addClass("hidden");
  }

  public show() {
    this.deleteClass("hidden");
  }
}
