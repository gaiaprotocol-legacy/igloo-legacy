import { DomNode, el } from "@common-module/app";
import TopUserList from "../explore/TopUserList.js";

export default class TopUserSection extends DomNode {
  constructor() {
    super(".top-user-section");
    this.append(
      el("h2", "Top Users"),
      new TopUserList().show(),
    );
  }
}
