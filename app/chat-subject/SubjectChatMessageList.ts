import { ChatMessageList, Message } from "sofi-module";
import IglooLoadingAnimation from "../IglooLoadingAnimation.js";
import IglooChatMessageInteractions from "../chat/IglooChatMessageInteractions.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
import { msg } from "common-app-module";

export default class SubjectChatMessageList extends ChatMessageList {
  constructor(subject: string) {
    super(
      ".subject-chat-message-list",
      {
        storeName: `subject-${subject}-chat-messages`,
        signedUserId: IglooSignedUserManager.user?.user_id,
        emptyMessage: msg("chat-message-list-empty-message"),
      },
      IglooChatMessageInteractions,
      new IglooLoadingAnimation(),
    );
  }

  protected fetchMessages(): Promise<Message[]> {
    throw new Error("Method not implemented.");
  }
}
