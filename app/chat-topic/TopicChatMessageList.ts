import { msg, Supabase } from "common-app-module";
import { ChatMessageList, Message } from "sofi-module";
import IglooLoadingAnimation from "../IglooLoadingAnimation.js";
import IglooChatMessageInteractions from "../chat/IglooChatMessageInteractions.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
import TopicChatMessageService from "./TopicChatMessageService.js";
import { RealtimeChannel } from "@supabase/supabase-js";

export default class TopicChatMessageList extends ChatMessageList {
  private channel: RealtimeChannel;

  constructor(private topic: string) {
    super(
      ".topic-chat-message-list",
      {
        storeName: `topic-${topic}-chat-messages`,
        signedUserId: IglooSignedUserManager.user?.user_id,
        emptyMessage: msg("chat-message-list-empty-message"),
      },
      IglooChatMessageInteractions,
      new IglooLoadingAnimation(),
    );

    this.channel = Supabase.client
      .channel(`topic-${topic}-chat-message-changes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "topic_chat_messages",
          filter: "topic=eq." + topic,
        },
        (payload: any) => this.addNewMessage(payload.new),
      )
      .subscribe();
  }

  protected async fetchMessages(): Promise<Message[]> {
    return await TopicChatMessageService.fetchMessages(this.topic);
  }

  public delete() {
    this.channel.unsubscribe();
    super.delete();
  }
}
