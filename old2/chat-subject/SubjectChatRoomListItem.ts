import { el, Router } from "@common-module/app";
import { SoFiUserPublic } from "@common-module/social";
import ChatRoomListItem from "../chat/ChatRoomListItem.js";
import Subject from "../database-interface/Subject.js";

export default class SubjectChatRoomListItem extends ChatRoomListItem {
  constructor(subject: Subject, subjectOwner: SoFiUserPublic) {
    super(".subject-chat-room-list-item", subject);
    this.append(
      el(".owner-profile-image", {
        style: { backgroundImage: `url(${subjectOwner.profile_image})` },
      }),
      el(
        ".info",
        el(
          ".owner-info",
          el(".name", subjectOwner.display_name),
          subjectOwner.x_username
            ? el(".x-username", `@${subjectOwner.x_username}`)
            : undefined,
        ),
        this.lastMessageDisplay,
      ),
    ).onDom(
      "click",
      () => Router.go(`/chat/${subject.subject}`),
    );
  }
}
