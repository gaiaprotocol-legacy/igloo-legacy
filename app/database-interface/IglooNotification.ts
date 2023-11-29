import { Notification } from "sofi-module";

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
