import { DomNode } from "common-dapp-module";
import Notification from "../database-interface/Notification.js";
import Post from "../database-interface/Post.js";

export default class NotificationListItem extends DomNode {
  constructor(notification: Notification, post?: Post) {
    super(".notification-list-item");
    console.log(notification, post);
  }
}
