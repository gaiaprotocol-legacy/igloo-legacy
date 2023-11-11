import { Post, PostSelectQuery, PostService } from "sofi-module";

class IglooPostService extends PostService<Post> {
  constructor() {
    super("posts", "reposts", "post_likes", PostSelectQuery, 50);
  }
}

export default new IglooPostService();
