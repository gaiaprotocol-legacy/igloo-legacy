import { msg } from "common-app-module";
import { ChatMessageList, Message } from "sofi-module";
import IglooLottieAnimation from "../IglooLottieAnimation.js";
import IglooChatMessageInteractions from "../chat/IglooChatMessageInteractions.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class TopicChatMessageList extends ChatMessageList {
  constructor(topic: string) {
    super(
      ".topic-chat-message-list",
      {
        storeName: `topic-${topic}-chat-messages`,
        signedUserId: SignedUserManager.user?.user_id,
        emptyMessage: msg("chat-message-list-empty-message"),
      },
      IglooChatMessageInteractions,
      new IglooLottieAnimation(),
    );
  }

  protected fetchMessages(): Promise<Message[]> {
    throw new Error("Method not implemented.");
  }
}
