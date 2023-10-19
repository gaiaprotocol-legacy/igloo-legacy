import { el, Router } from "common-dapp-module";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import UserDetails from "../database-interface/UserDetails.js";
import UserDetailsCacher from "../user/UserDetailsCacher.js";
import ChatRoomListItem from "./ChatRoomListItem.js";

export default class SubjectListItem extends ChatRoomListItem {
  private userDetails: UserDetails;

  constructor(subjectDetails: SubjectDetails) {
    super(".subject-list-item");

    this.userDetails = UserDetailsCacher.getByWalletAddress(
      subjectDetails.subject,
    );

    this.render();
    this.onDelegate(UserDetailsCacher, "update", (userDetails: UserDetails) => {
      if (userDetails.user_id === this.userDetails.user_id) {
        this.userDetails = userDetails;
        this.render();
      }
    });

    this.onDom("click", () => Router.go(`/chats/${subjectDetails.subject}`));
  }

  private render() {
    this.empty().append(
      el(".user-profile-image", {
        style: { backgroundImage: `url(${this.userDetails.profile_image})` },
      }),
      el(
        ".user-info",
        el(".name", this.userDetails.display_name),
        this.userDetails.x_username
          ? el(".x-username", `@${this.userDetails.x_username}`)
          : undefined,
      ),
    );
  }
}
