import { DomNode, Tabs } from "@common-module/app";
import FollowerList from "./connections/FollowerList.js";
import FollowingList from "./connections/FollowingList.js";
import HolderList from "./connections/HolderList.js";
import HoldingList from "./connections/HoldingList.js";

export default class UserConnections extends DomNode {
  private tabs: Tabs | undefined;
  private holdingList: HoldingList | undefined;
  private holderList: HolderList | undefined;
  private followingList: FollowingList | undefined;
  private followerList: FollowerList | undefined;

  constructor(
    userId: string | undefined,
    walletAddress: string | undefined,
    keyHoldingCount: number,
    keyHolderCount: number,
    followingCount: number,
    followerCount: number,
  ) {
    super(".user-connections");
  }

  public updateUserId(userId: string) {
  }

  public updateWalletAddress(walletAddress: string) {
  }

  public updateCounts(
    keyHoldingCount: number,
    keyHolderCount: number,
    followingCount: number,
    followerCount: number,
  ) {
  }
}
