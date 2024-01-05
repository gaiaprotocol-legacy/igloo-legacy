import { EventContainer, Store } from "@common-module/app";

class SubjectChatMessageCacher extends EventContainer {
  private store: Store = new Store("cached-subject-chat-messages");

  constructor() {
    super();
    this.addAllowedEvents("update");
  }
}

export default new SubjectChatMessageCacher();
