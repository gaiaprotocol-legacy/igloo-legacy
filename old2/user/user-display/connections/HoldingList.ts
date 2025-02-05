import { msg } from "@common-module/app";
import UserList from "../../UserList.js";

export default class HoldingList extends UserList {
  constructor(walletAddress: string) {
    super(".holding-list", msg("holding-list-empty-message"));
  }

  protected fetchUsers(): void {
    throw new Error("Method not implemented.");
  }
}
