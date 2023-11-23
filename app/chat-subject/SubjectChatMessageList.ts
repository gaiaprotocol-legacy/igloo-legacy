import { ChatMessageList, Message } from "sofi-module";
import IglooLottieAnimation from "../IglooLottieAnimation.js";
import IglooChatMessageInteractions from "../chat/IglooChatMessageInteractions.js";
import SignedUserManager from "../user/SignedUserManager.js";
import { msg } from "common-app-module";

export default class SubjectChatMessageList extends ChatMessageList {
  constructor(subject: string) {
    super(
      ".subject-chat-message-list",
      {
        storeName: `subject-${subject}-chat-messages`,
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
