import { DomNode } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import PreviewUserPublic from "../database-interface/PreviewUserPublic.js";
import Subject from "../database-interface/Subject.js";
import UserProfile from "./user-display/UserProfile.js";

export default class UserDisplay extends DomNode {
  private userProfile: UserProfile;

  constructor(
    userPublic: SoFiUserPublic | undefined,
    subject: Subject | undefined,
    keyHoldingCount: number,
    portfolioValue: bigint,
    previewUserPublic?: PreviewUserPublic,
  ) {
    super(".user-display");
    if (userPublic) {
      this.userProfile = new UserProfile(userPublic).appendTo(this);
      this.update(userPublic, subject, keyHoldingCount, portfolioValue);
    } else if (previewUserPublic) {
      this.userProfile = new UserProfile(previewUserPublic).appendTo(this);
    } else {
      this.userProfile = new UserProfile({}, true).appendTo(this);
    }
  }

  public update(
    userPublic: SoFiUserPublic,
    subject: Subject | undefined,
    keyHoldingCount: number,
    portfolioValue: bigint,
  ) {
    this.userProfile.update(userPublic);
    console.log(userPublic, subject, keyHoldingCount, portfolioValue);
  }
}
