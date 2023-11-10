import { DomNode } from "common-app-module";

export default class TopUserSection extends DomNode {
  constructor() {
    super(".top-user-section");
  }

  public hide() {
    this.addClass("hidden");
  }

  public show() {
    this.deleteClass("hidden");
  }
}
