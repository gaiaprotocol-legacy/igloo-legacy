import { el, Router } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import ChatRoomListItem from "../chat/ChatRoomListItem.js";
import Subject from "../database-interface/Subject.js";

export default class SubjectChatRoomListItem extends ChatRoomListItem {
  constructor(subject: Subject, owner: SoFiUserPublic) {
    super(".subject-chat-room-list-item", subject);
    this.append(
      el(".owner-profile-image", {
        style: { backgroundImage: `url(${owner.profile_image})` },
      }),
      el(
        ".info",
        el(
          ".owner-info",
          el(".name", owner.display_name),
          owner.x_username
            ? el(".x-username", `@${owner.x_username}`)
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
