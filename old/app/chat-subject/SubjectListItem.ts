import { el, Router } from "common-app-module";
import dayjs from "dayjs";
import ChatRoomListItem from "../chat/ChatRoomListItem.js";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import UserDetails from "../database-interface/UserDetails.js";
import SubjectDetailsCacher from "../subject/SubjectDetailsCacher.js";
import UserDetailsCacher from "../user/UserDetailsCacher.js";

export default class SubjectListItem extends ChatRoomListItem {
  private userDetails: UserDetails;

  constructor(private subjectDetails: SubjectDetails) {
    super(".subject-list-item");

    this.userDetails = UserDetailsCacher.getByWalletAddress(
      subjectDetails.subject,
    );

    this.render();

    this.onDelegate(
      SubjectDetailsCacher,
      "update",
      (subjectDetails: SubjectDetails) => {
        if (subjectDetails.subject === this.subjectDetails.subject) {
          this.subjectDetails = subjectDetails;
          this.render();
        }
      },
    );

    this.onDelegate(UserDetailsCacher, "update", (userDetails: UserDetails) => {
      if (userDetails.wallet_address === this.subjectDetails.subject) {
        this.userDetails = userDetails;
        this.render();
      }
    });

    this.onDom("click", () => Router.go(`/chats/${subjectDetails.subject}`));
  }

  private render() {
    this.empty().append(
      el(".subject-owner-profile-image", {
        style: { backgroundImage: `url(${this.userDetails.profile_image})` },
      }),
      el(
        ".info",
        el(
          ".subject-owner-info",
          el(".name", this.userDetails.display_name),
          this.userDetails.x_username
            ? el(".x-username", `@${this.userDetails.x_username}`)
            : undefined,
        ),
        el(
          ".last-message-info",
          el(".message", this.subjectDetails.last_message ?? ""),
          el(
            ".sent-at",
            this.subjectDetails.last_message_sent_at === "-infinity"
              ? ""
              : dayjs(this.subjectDetails.last_message_sent_at).fromNow(true),
          ),
        ),
      ),
    );
  }
}
