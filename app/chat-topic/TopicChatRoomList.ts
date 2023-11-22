import { ListLoadingBar, msg } from "common-app-module";
import { Topic } from "sofi-module";
import ChatRoomList from "../chat/ChatRoomList.js";

export default class TopicChatRoomList extends ChatRoomList {
  constructor() {
    super(".topic-chat-room-list", {
      storeName: "topic-chat-rooms",
      emptyMessage: msg("topic-chat-room-list-empty-message"),
    });

    const cachedTopics = this.store.get<Topic[]>("cached-topics");
    if (cachedTopics && cachedTopics.length > 0) {
      for (const t of cachedTopics) {
        //TODO:
      }
    } else {
      this.append(new ListLoadingBar());
    }
  }
}
