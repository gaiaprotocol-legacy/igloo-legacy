import { el, MaterialIcon } from "common-dapp-module";
import ChatRoomHeader from "../chat/ChatRoomHeader.js";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import UserDetails from "../database-interface/UserDetails.js";
import SubjectDetailsCacher from "../subject/SubjectDetailsCacher.js";
import UserDetailsCacher from "../user/UserDetailsCacher.js";

export default class SubjectChatRoomHeader extends ChatRoomHeader {
  private subjectDetails: SubjectDetails;
  private userDetails: UserDetails;

  constructor(private subject: string) {
    super(".subject-chat-room-header");

    this.subjectDetails = SubjectDetailsCacher.getAndRefresh(subject);
    this.userDetails = UserDetailsCacher.getAndRefreshByWalletAddress(subject);

    this.render();

    this.onDelegate(
      SubjectDetailsCacher,
      "update",
      (subjectDetails: SubjectDetails) => {
        if (subjectDetails.subject === this.subject) {
          this.subjectDetails = subjectDetails;
          this.render();
        }
      },
    );

    this.onDelegate(UserDetailsCacher, "update", (userDetails: UserDetails) => {
      if (userDetails.wallet_address === this.subject) {
        this.userDetails = userDetails;
        this.render();
      }
    });
  }

  private render() {
    this.empty().append(
      el("header"),
      el(
        "footer",
        el("button.close", new MaterialIcon("close"), {
          click: () => history.back(),
        }),
      ),
    );
  }
}
