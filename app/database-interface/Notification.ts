export enum Notificationype {
  BUY_KEY,
  SELL_KEY,
  FOLLOW,
  POST_LIKE,
  REPOST,
  POST_COMMENT,
  POST_TAG,
}

export default interface Notification {
  id: number;
  user_id: string;
  triggered_by: string;
  type: number;
  source_id?: number;
  amount?: number;
  read_at?: string;
  created_at: string;
}
