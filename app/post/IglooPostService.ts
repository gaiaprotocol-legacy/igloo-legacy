import { PostSelectQuery, PostService } from "sofi-module";
import IglooPost from "../database-interface/IglooPost.js";

class IglooPostService extends PostService<IglooPost> {
  constructor() {
    super("posts", "reposts", "post_likes", PostSelectQuery, 50);
  }
}

export default new IglooPostService();
