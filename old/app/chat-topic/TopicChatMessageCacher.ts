import { EventContainer, Store } from "@common-module/app";

class TopicChatMessageCacher extends EventContainer {
  private store: Store = new Store("cached-topic-chat-messages");

  constructor() {
    super();
    this.addAllowedEvents("update");
  }
}

export default new TopicChatMessageCacher();
