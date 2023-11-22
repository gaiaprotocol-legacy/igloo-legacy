import ChatRoomList, { ChatRoomListOptions } from "../chat/ChatRoomList.js";

export default abstract class SubjectChatRoomList extends ChatRoomList {
  constructor(tag: string, options: ChatRoomListOptions) {
    super(tag + ".subject-chat-room-list", options);
  }
}
