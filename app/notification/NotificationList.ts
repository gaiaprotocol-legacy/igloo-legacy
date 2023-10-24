import { RealtimeChannel } from "@supabase/supabase-js";
import { DomNode, el, Store, Supabase } from "common-dapp-module";
import Notification, {
  NotificationType,
} from "../database-interface/Notification.js";
import Post from "../database-interface/Post.js";
import PostService from "../post/PostService.js";
import UserDetailsCacher from "../user/UserDetailsCacher.js";
import UserService from "../user/UserService.js";
import NotificationListItem from "./NotificationListItem.js";

export default class NotificationList extends DomNode {
  private store: Store = new Store("notification-list");
  private isContentFromCache: boolean = true;
  private emptyMessageDisplay: DomNode | undefined;
  private channel: RealtimeChannel;

  private checkNotiIsPost(noti: Notification) {
    return (
      noti.type === NotificationType.POST_LIKE ||
      noti.type === NotificationType.REPOST ||
      noti.type === NotificationType.POST_COMMENT ||
      noti.type === NotificationType.POST_TAG
    );
  }

  constructor(private userId: string) {
    super(".notification-list");
    this.showEmptyMessage();

    const cachedNotifications = this.store.get<Notification[]>(
      "cached-notifications",
    );

    const cachedPosts = this.store.get<Post[]>(
      "cached-posts",
    ) ?? [];

    if (cachedNotifications) {
      for (const notification of cachedNotifications) {
        if (this.checkNotiIsPost(notification)) {
          const post = cachedPosts.find((post) =>
            post.id === notification.source_id
          );
          this.addNotification(notification, post);
        } else {
          this.addNotification(notification);
        }
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
        async (payload: any) => {
          const cachedNotifications = this.store.get<Notification[]>(
            "cached-notifications",
          ) ?? [];
          cachedNotifications.push(payload.new);
          this.store.set("cached-notifications", cachedNotifications, true);

          const cachedPosts = this.store.get<Post[]>(
            "cached-posts",
          ) ?? [];
          let post = cachedPosts.find((post) =>
            post.id === payload.new.source_id
          );
          if (!post && this.checkNotiIsPost(payload.new)) {
            post = await PostService.fetchPost(payload.new.source_id);
          }
          if (post) {
            cachedPosts.push(post);
            this.store.set("cached-posts", cachedPosts, true);
          }

          this.addNotification(payload.new, post);
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

  private addNotification(notification: Notification, post?: Post) {
    this.emptyMessageDisplay?.delete();
    this.append(new NotificationListItem(notification, post));
  }

  private async fetchNotifications() {
    const { data: notiData, error: notiError } = await Supabase.client.from(
      "notifications",
    ).select()
      .eq("user_id", this.userId)
      .order(
        "created_at",
        { ascending: false },
      );
    if (notiError) throw notiError;

    const postIds = notiData.filter((noti) => this.checkNotiIsPost(noti)).map(
      (noti) => noti.source_id,
    );

    const { data: postData, error: postError } = await Supabase.client.from(
      "posts",
    ).select().in("id", postIds);
    if (postError) throw postError;

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-notifications", notiData, true);
      this.store.set("cached-posts", postData, true);
      await this.fetchUsers(notiData);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      if (notiData.length === 0) {
        this.showEmptyMessage();
      } else {
        for (const event of notiData) {
          this.addNotification(event);
        }
      }
    }
  }

  protected async fetchUsers(notifications: Notification[]) {
    const userIds: string[] = [];
    for (const notification of notifications) {
      if (!userIds.includes(notification.user_id)) {
        userIds.push(notification.user_id);
      }
      if (!userIds.includes(notification.triggered_by)) {
        userIds.push(notification.triggered_by);
      }
    }
    const userDetailsSet = await UserService.fetchByIds(userIds);
    UserDetailsCacher.cacheMultiple(userDetailsSet);
  }

  public delete() {
    this.channel.unsubscribe();
    super.delete();
  }
}
