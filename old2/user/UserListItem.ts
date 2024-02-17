import { DomNode } from "@common-module/app";
import { SoFiUserPublic } from "@common-module/social";

export default class UserListItem extends DomNode {
  constructor(private user: SoFiUserPublic) {
    super(".user-list-item");
  }
}
