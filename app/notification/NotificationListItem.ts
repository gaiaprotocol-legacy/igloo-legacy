import { DomNode, el, Router } from "common-app-module";
import dayjs from "dayjs";
import Notification, {
  NotificationType,
} from "../database-interface/Notification.js";
import Post from "../database-interface/Post.js";
import UserDetails from "../database-interface/UserDetails.js";

export default class NotificationListItem extends DomNode {
  constructor(notification: Notification, triggerer: UserDetails, post?: Post) {
    super(".notification-list-item");

    this.append(el(".triggerer-profile-image", {
      style: { backgroundImage: `url(${triggerer.profile_image})` },
      click: (event) => {
        event.stopPropagation();
        Router.go(`/${triggerer.x_username}`);
      },
    }));

    if (notification.type === NotificationType.BUY_KEY) {
      this.addClass("buy-key").append(
        el(
          "main",
          el(
            "header",
            el("b", triggerer.display_name),
            " purchased " + notification.amount + " ice(s)",
          ),
          el(
            ".date",
            dayjs(notification.created_at).fromNow(true),
          ),
        ),
      );
    } else if (notification.type === NotificationType.SELL_KEY) {
      this.addClass("sell-key").append(
        el(
          "main",
          el(
            "header",
            el("b", triggerer.display_name),
            " sold " + notification.amount + " ice(s)",
          ),
          el(
            ".date",
            dayjs(notification.created_at).fromNow(true),
          ),
        ),
      );
    } else if (notification.type === NotificationType.FOLLOW) {
      this.addClass("follow").append(
        el(
          "main",
          el(
            "header",
            el("b", triggerer.display_name),
            " started following you",
          ),
          el(
            ".date",
            dayjs(notification.created_at).fromNow(true),
          ),
        ),
      );
    } else if (notification.type === NotificationType.POST_LIKE) {
      this.addClass("post-like").append(
        el(
          "main",
          el(
            "header",
            el("b", triggerer.display_name),
            " liked your post",
          ),
          el("p", post?.message),
          el(
            ".date",
            dayjs(notification.created_at).fromNow(true),
          ),
        ),
      ).onDom("click", () => Router.go(`/post/${post?.id}`));
    } else if (notification.type === NotificationType.REPOST) {
      this.addClass("repost").append(
        el(
          "main",
          el(
            "header",
            el("b", triggerer.display_name),
            " reposted your post",
          ),
          el("p", post?.message),
          el(
            ".date",
            dayjs(notification.created_at).fromNow(true),
          ),
        ),
      ).onDom("click", () => Router.go(`/post/${post?.id}`));
    } else if (notification.type === NotificationType.POST_COMMENT) {
      this.addClass("post-comment").append(
        el(
          "main",
          el(
            "header",
            el("b", triggerer.display_name),
            " commented on your post",
          ),
          el("p", post?.message),
          el(
            ".date",
            dayjs(notification.created_at).fromNow(true),
          ),
        ),
      ).onDom("click", () => Router.go(`/post/${post?.id}`));
    } else if (notification.type === NotificationType.POST_TAG) {
      this.addClass("post-tag").append(
        el(
          "main",
          el(
            "header",
            el("b", triggerer.display_name),
            " tagged you in a post",
          ),
          el("p", post?.message),
          el(
            ".date",
            dayjs(notification.created_at).fromNow(true),
          ),
        ),
      ).onDom("click", () => Router.go(`/post/${post?.id}`));
    }
  }
}
