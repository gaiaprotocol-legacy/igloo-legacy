import { TopicService } from "sofi-module";

class IglooTopicService extends TopicService {
  constructor() {
    super("topics", "*", 50);
  }
}

export default new IglooTopicService();
