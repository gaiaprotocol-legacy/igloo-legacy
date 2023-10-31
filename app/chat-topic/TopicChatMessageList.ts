import { RealtimeChannel } from "@supabase/supabase-js";
import { Store, Supabase } from "common-app-module";
import ChatMessageList from "../chat/ChatMessageList.js";
import TopicChatMessage from "../database-interface/TopicChatMessage.js";
import TopicChatService from "./TopicChatService.js";

export default class TopicChatMessageList extends ChatMessageList {
  private store: Store;
  private isContentFromCache: boolean = true;
  private channel: RealtimeChannel;

  constructor(public topic: string) {
    super(".topic-chat-message-list", "No messages yet.");
    this.store = new Store(`topic-${topic}-chat-message-list`);

    const cachedMessages = this.store.get<TopicChatMessage[]>(
      "cached-messages",
    );
    if (cachedMessages) {
      for (const message of cachedMessages) {
        this.addMessage(message, false);
      }
    }
    this.fetchMessages();

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
        (payload: any) => {
          this.findMessageItem(payload.new.id)?.delete();

          const cachedMessages = this.store.get<TopicChatMessage[]>(
            "cached-messages",
          ) ?? [];
          cachedMessages.push(payload.new);
          this.store.set("cached-messages", cachedMessages, true);

          this.addMessage(payload.new, true);
        },
      )
      .subscribe();
  }

  private async fetchMessages() {
    const cachedMessages = this.store.get<TopicChatMessage[]>(
      "cached-messages",
    ) ?? [];

    const messages = (await TopicChatService.fetchLatestMessages(this.topic))
      .reverse();

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-messages", messages, true);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      if (messages.length === 0) {
        this.showEmptyMessage();
      } else {
        for (const message of messages) {
          this.addMessage(
            message,
            cachedMessages.find((m) => m.id === message.id) === undefined,
          );
        }
      }
    }
  }

  public delete() {
    this.channel.unsubscribe();
    super.delete();
  }
}
