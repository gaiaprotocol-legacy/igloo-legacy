import TopicList from "../chat-topic/TopicList.js";

export default class GeneralTopicList extends TopicList {
  constructor() {
    super(".general-topic-list", "No general topics yet.");
    this.addTopic("general");
  }
}
