import { DomNode } from "@common-module/app";

export default class TrendSection extends DomNode {
  constructor() {
    super(".trend-section");
  }

  public hide() {
    this.addClass("hidden");
  }

  public show() {
    this.deleteClass("hidden");
  }
}
