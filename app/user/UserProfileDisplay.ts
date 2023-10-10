import { DomNode } from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";

export default class UserProfileDisplay extends DomNode {
  constructor(userDetails: UserDetails) {
    super(".user-profile-display");
  }
}
