import { DomNode } from "common-dapp-module";
import Notification from "../database-interface/Notification.js";
import Post from "../database-interface/Post.js";
import UserDetails from "../database-interface/UserDetails.js";

export default class NotificationListItem extends DomNode {
  constructor(notification: Notification, triggerer: UserDetails, post?: Post) {
    super(".notification-list-item");
    console.log(notification, triggerer, post);
  }
}
