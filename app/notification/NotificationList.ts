import { RealtimeChannel } from "@supabase/supabase-js";
import { DomNode, el, Store, Supabase } from "common-dapp-module";
import Notification from "../database-interface/Notification.js";
import NotificationListItem from "./NotificationListItem.js";

export default class NotificationList extends DomNode {
  private store: Store = new Store("notification-list");
  private isContentFromCache: boolean = true;
  private emptyMessageDisplay: DomNode | undefined;
  private channel: RealtimeChannel;

  constructor(private userId: string) {
    super(".notification-list");
    this.showEmptyMessage();

    const cachedNotifications = this.store.get<Notification[]>(
      "cached-notifications",
    );
    if (cachedNotifications) {
      for (const notification of cachedNotifications) {
        this.addNotification(notification);
      }
    }
    this.fetchNotifications();

    this.channel = Supabase.client
      .channel("notification-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: "user_id=eq." + userId,
        },
        (payload: any) => {
          const cachedNotifications = this.store.get<Notification[]>(
            "cached-notifications",
          ) ?? [];
          cachedNotifications.push(payload.new);
          this.store.set("cached-notifications", cachedNotifications, true);
          this.addNotification(payload.new);
        },
      )
      .subscribe();
  }

  private showEmptyMessage() {
    this.emptyMessageDisplay?.delete();
    this.emptyMessageDisplay = el("p.empty-message", "No notifications yet");
    this.emptyMessageDisplay.on(
      "delete",
      () => this.emptyMessageDisplay = undefined,
    );
    this.append(this.emptyMessageDisplay);
  }

  private addNotification(notification: Notification) {
    this.emptyMessageDisplay?.delete();
    this.append(new NotificationListItem(notification));
  }

  private async fetchNotifications() {
    const { data, error } = await Supabase.client.from(
      "notifications",
    ).select()
      .eq("user_id", this.userId)
      .order(
        "created_at",
        { ascending: false },
      );
    if (error) throw error;

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-notifications", data, true);
      //TODO: await this.fetchUsers(data);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      if (data.length === 0) {
        this.showEmptyMessage();
      } else {
        for (const event of data) {
          this.addNotification(event);
        }
      }
    }
  }

  public delete() {
    this.channel.unsubscribe();
    super.delete();
  }
}
