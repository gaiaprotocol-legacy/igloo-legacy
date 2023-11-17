import { PostList } from "sofi-module";
import IglooPost from "../../../database-interface/IglooPost.js";

export default class UserCommentPostList extends PostList<IglooPost> {
  protected fetchPosts(): Promise<
    {
      fetchedPosts: { posts: IglooPost[]; mainPostId: number }[];
      repostedPostIds: number[];
      likedPostIds: number[];
    }
  > {
    throw new Error("Method not implemented.");
  }
}
