import { RealtimeChannel } from "@supabase/supabase-js";
import { Store, Supabase } from "@common-module/app";
import ChatMessageList from "../chat/ChatMessageList.js";
import SubjectChatMessage from "../database-interface/SubjectChatMessage.js";
import SubjectChatService from "./SubjectChatService.js";

export default class SubjectChatMessageList extends ChatMessageList {
  private store: Store;
  private isContentFromCache: boolean = true;
  private channel: RealtimeChannel;

  constructor(public subject: string) {
    super(".subject-chat-message-list", "No messages yet.");
    this.store = new Store(`subject-${this.subject}-chat-message-list`);

    const cachedMessages = this.store.get<SubjectChatMessage[]>(
      "cached-messages",
    );
    if (cachedMessages) {
      for (const message of cachedMessages) {
        this.addMessage(message, false, true);
      }
    }
    this.fetchMessages();

    this.channel = Supabase.client
      .channel(`subject-${subject}-chat-message-changes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "subject_chat_messages",
          filter: "subject=eq." + subject,
        },
        (payload: any) => {
          this.findMessageItem(payload.new.id)?.delete();

          const cachedMessages = this.store.get<SubjectChatMessage[]>(
            "cached-messages",
          ) ?? [];
          cachedMessages.push(payload.new);
          this.store.set("cached-messages", cachedMessages, true);

          this.addMessage(payload.new, true, this.scrolledToBottom);
        },
      )
      .subscribe();
  }

  private async fetchMessages() {
    const cachedMessages = this.store.get<SubjectChatMessage[]>(
      "cached-messages",
    ) ?? [];

    const messages =
      (await SubjectChatService.fetchLatestMessages(this.subject))
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
            true,
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
