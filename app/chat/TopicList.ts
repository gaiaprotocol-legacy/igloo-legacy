import ChatRoomList from "./ChatRoomList.js";

export default abstract class TopicList extends ChatRoomList {
  constructor(tag: string, emptyMessage: string) {
    super(tag, emptyMessage);
  }
}
