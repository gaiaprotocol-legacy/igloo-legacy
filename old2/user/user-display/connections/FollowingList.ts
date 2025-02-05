import { msg } from "@common-module/app";
import UserList from "../../UserList.js";

export default class FollowingList extends UserList {
  constructor(userId: string) {
    super(".following-list", msg("following-list-empty-message"));
  }

  protected fetchUsers(): void {
    throw new Error("Method not implemented.");
  }
}
