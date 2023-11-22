import { el, msg, View } from "common-app-module";
import FollowingSubjectChatRoomList from "../chat-subject/FollowingSubjectChatRoomList.js";
import HoldingSubjectChatRoomList from "../chat-subject/HoldingSubjectChatRoomList.js";
import MySubjectChatRoomList from "../chat-subject/MySubjectChatRoomList.js";
import TopicChatRoomList from "../chat-topic/TopicChatRoomList.js";
import Layout from "../layout/Layout.js";
import LoginRequiredDisplay from "../user/LoginRequiredDisplay.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class ChatsView extends View {
  constructor() {
    super();
    Layout.append(
      this.container = el(
        ".chats-view",
        el("h1", msg("chats-view-title")),
        el(
          "main",
          el(
            "section",
            el("h2", msg("chats-view-general-section-title")),
            new TopicChatRoomList(),
          ),
          ...(!SignedUserManager.signed ? [new LoginRequiredDisplay()] : [
            el(
              "section",
              el("h2", msg("chats-view-my-subject-section-title")),
              new MySubjectChatRoomList(),
            ),
            el(
              "section",
              el("h2", msg("chats-view-holding-subject-section-title")),
              new HoldingSubjectChatRoomList(),
            ),
            el(
              "section",
              el("h2", msg("chats-view-following-subject-section-title")),
              new FollowingSubjectChatRoomList(),
            ),
          ]),
        ),
      ),
    );
  }
}
