import { el, MaterialIcon, Router } from "common-dapp-module";
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
      el(
        "header",
        el(".subject-owner-profile-image", {
          style: { backgroundImage: `url(${this.userDetails.profile_image})` },
          click: () => Router.go(`/${this.userDetails.x_username}`),
        }),
        el(
          ".subject-owner-info",
          el(".name", this.userDetails.display_name, {
            click: () => Router.go(`/${this.userDetails.x_username}`),
          }),
          this.userDetails.x_username
            ? el(".x-username", `@${this.userDetails.x_username}`, {
              click: () => Router.go(`/${this.userDetails.x_username}`),
            })
            : undefined,
        ),
      ),
      el(
        "footer",
        el("button.close", new MaterialIcon("close"), {
          click: () => history.back(),
        }),
      ),
    );
  }
}
