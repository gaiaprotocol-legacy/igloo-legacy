import { DomNode } from "common-dapp-module";
import Notification from "../database-interface/Notification.js";

export default class NotificationListItem extends DomNode {
  constructor(notification: Notification) {
    super(".notification-list-item");
    console.log(notification);
  }
}
