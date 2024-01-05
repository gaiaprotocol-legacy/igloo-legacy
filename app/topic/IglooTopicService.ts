import { TopicService } from "@common-module/social";

class IglooTopicService extends TopicService {
  constructor() {
    super("topics", "*", 50);
  }
}

export default new IglooTopicService();
