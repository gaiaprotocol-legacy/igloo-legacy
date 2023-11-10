import ChatRoomList from "../chat/ChatRoomList.js";
import TopicListItem from "./TopicListItem.js";

export default abstract class TopicList extends ChatRoomList {
  constructor(tag: string, emptyMessage: string) {
    super(tag + ".topic-list", emptyMessage);
  }

  protected addTopic(topic: string) {
    this.emptyMessageDisplay?.delete();
    this.append(new TopicListItem(topic));
  }
}
