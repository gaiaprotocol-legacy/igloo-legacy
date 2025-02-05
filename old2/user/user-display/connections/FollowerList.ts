import { msg } from "@common-module/app";
import UserList from "../../UserList.js";

export default class FollowerList extends UserList {
  constructor(userId: string) {
    super(".follower-list", msg("follower-list-empty-message"));
  }

  protected fetchUsers(): void {
    throw new Error("Method not implemented.");
  }
}
