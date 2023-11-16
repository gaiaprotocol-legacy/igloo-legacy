import { DomNode } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import PreviewUserPublic from "../database-interface/PreviewUserPublic.js";

export default class UserDisplay extends DomNode {
  constructor(
    userPublic: SoFiUserPublic | undefined,
    previewUserPublic?: PreviewUserPublic,
  ) {
    super(".user-display");
    if (userPublic) this.update(userPublic);
  }

  public update(userPublic: SoFiUserPublic) {
    // ...
  }
}
