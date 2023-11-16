import { DomNode } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import PreviewUserPublic from "../database-interface/PreviewUserPublic.js";
import Subject from "../database-interface/Subject.js";

export default class UserDisplay extends DomNode {
  constructor(
    userPublic: SoFiUserPublic | undefined,
    subject: Subject | undefined,
    keyHoldingCount: number,
    portfolioValue: bigint,
    previewUserPublic?: PreviewUserPublic,
  ) {
    super(".user-display");
    if (userPublic) {
      this.update(userPublic, subject, keyHoldingCount, portfolioValue);
    }
  }

  public update(
    userPublic: SoFiUserPublic,
    subject: Subject | undefined,
    keyHoldingCount: number,
    portfolioValue: bigint,
  ) {
    // ...
  }
}
