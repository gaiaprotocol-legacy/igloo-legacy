import { RealtimeChannel } from "@supabase/supabase-js";
import { msg, Supabase } from "@common-module/app";
import { ChatMessageList, Message } from "@common-module/social";
import IglooChatMessageInteractions from "../chat/IglooChatMessageInteractions.js";
import IglooLoadingAnimation from "../IglooLoadingAnimation.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
import TopicChatMessageService from "./TopicChatMessageService.js";

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
        async (payload: any) => {
          const message = await TopicChatMessageService.fetchMessage(
            payload.new.id,
          );
          if (message) this.addNewMessage(message);
        },
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
