import { DomNode, el, Router } from "common-app-module";
import dayjs from "dayjs";
import { ethers } from "ethers";
import BlockTimeManager from "../BlockTimeManager.js";
import SubjectTradeEvent from "../database-interface/SubjectTradeEvent.js";
import UserDetailsCacher from "../user/UserDetailsCacher.js";

export default class ActivityListItem extends DomNode {
  constructor(subjectContractEvent: SubjectTradeEvent) {
    super(".activity-list-item");

    const traderDetails = UserDetailsCacher.getByWalletAddress(
      subjectContractEvent.wallet_address,
    );
    const ownerDetails = UserDetailsCacher.getByWalletAddress(
      subjectContractEvent.subject,
    );
    const isBuy = subjectContractEvent.args[2] === "true";
    const amount = subjectContractEvent.args[3];
    const price = ethers.formatEther(subjectContractEvent.args[4]);

    this.append(
      el(
        "header",
        el(".trader-profile-image", {
          style: { backgroundImage: `url(${traderDetails.profile_image})` },
          click: () => Router.go(`/${traderDetails.x_username}`),
        }),
        el(".owner-profile-image", {
          style: { backgroundImage: `url(${ownerDetails.profile_image})` },
          click: () => Router.go(`/${ownerDetails.x_username}`),
        }),
      ),
      el(
        "p.description",
        el("a", traderDetails.display_name, {
          click: () => Router.go(`/${traderDetails.x_username}`),
        }),
        (isBuy ? " bought " : " sold ") + amount + " ",
        el("a", ownerDetails.display_name, {
          click: () => Router.go(`/${ownerDetails.x_username}`),
        }),
        " key for ",
        price,
        " AVAX.",
      ),
      el(
        ".date",
        dayjs(BlockTimeManager.blockToTime(subjectContractEvent.block_number))
          .fromNow(true),
      ),
    );
  }
}
