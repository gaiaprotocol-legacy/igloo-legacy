import { DomNode, el, MaterialIcon } from "common-dapp-module";

export default class TopUserSection extends DomNode {
  constructor() {
    super(".top-user-section");
    this.append(
    );
  }

  public hide() {
    this.addClass("hidden");
  }

  public show() {
    this.deleteClass("hidden");
  }
}
