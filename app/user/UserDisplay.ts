import { DomNode, el } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import PreviewUserPublic from "../database-interface/PreviewUserPublic.js";
import Subject from "../database-interface/Subject.js";
import UserConnections from "./user-display/UserConnections.js";
import UserPosts from "./user-display/UserPosts.js";
import UserProfile, { UserProfileData } from "./user-display/UserProfile.js";

export default class UserDisplay extends DomNode {
  private userId: string | undefined;
  private walletAddress: string | undefined;

  private userProfile: UserProfile;
  private userConnections: UserConnections;
  private userPosts: UserPosts;

  constructor(
    userPublic: SoFiUserPublic | undefined,
    subject: Subject | undefined,
    keyHoldingCount: number,
    portfolioValue: bigint,
    previewUserPublic?: PreviewUserPublic,
  ) {
    super(".user-display");

    let userProfileData: UserProfileData;
    let loading = false;

    if (userPublic) {
      this.userId = userPublic.user_id;
      this.walletAddress = userPublic.wallet_address;
      userProfileData = userPublic;
    } else if (previewUserPublic) {
      this.userId = previewUserPublic.user_id;
      userProfileData = {
        ...previewUserPublic,
        total_earned_trading_fees: "0",
      };
    } else {
      userProfileData = { total_earned_trading_fees: "0" };
      loading = true;
    }

    this.append(
      el(
        "section.profile",
        this.userProfile = new UserProfile(
          userProfileData,
          subject,
          keyHoldingCount,
          portfolioValue,
          loading,
        ),
        this.userConnections = new UserConnections(
          this.userId,
          userPublic?.wallet_address,
          keyHoldingCount,
          subject?.key_holder_count ?? 0,
          userPublic?.following_count ?? 0,
          userPublic?.follower_count ?? 0,
        ),
      ),
      this.userPosts = new UserPosts(this.userId),
    );
  }

  public update(
    userPublic: SoFiUserPublic,
    subject: Subject | undefined,
    keyHoldingCount: number,
    portfolioValue: bigint,
  ) {
    this.userProfile.update(
      userPublic,
      subject,
      keyHoldingCount,
      portfolioValue,
    );

    if (this.userId !== userPublic.user_id) {
      this.userId = userPublic.user_id;
      this.userConnections.updateUserId(userPublic.user_id);
      this.userPosts.update(userPublic.user_id);
    }

    if (
      userPublic.wallet_address &&
      this.walletAddress !== userPublic.wallet_address
    ) {
      this.walletAddress = userPublic.wallet_address;
      this.userConnections.updateWalletAddress(this.walletAddress);
    }

    this.userConnections.updateCounts(
      keyHoldingCount,
      subject?.key_holder_count ?? 0,
      userPublic.following_count,
      userPublic.follower_count,
    );
  }
}
