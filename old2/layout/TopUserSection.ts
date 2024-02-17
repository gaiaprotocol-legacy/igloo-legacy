import { DomNode } from "@common-module/app";

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
