import { Notification } from "@common-module/social";

export enum IglooNotificationType {
  BUY_KEY,
  SELL_KEY,
  FOLLOW,
  POST_LIKE,
  REPOST,
  POST_COMMENT,
  POST_TAG,
}

export default interface IglooNotification
  extends Notification<IglooNotificationType> {
  type: IglooNotificationType;
  amount?: number;
}
