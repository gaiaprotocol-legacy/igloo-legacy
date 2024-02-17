import { Router } from "@common-module/app";
import { Author, PostInteractions } from "@common-module/social";
import IglooPost from "../database-interface/IglooPost.js";
import IglooPostService from "./IglooPostService.js";
import PostCommentPopup from "./PostCommentPopup.js";
import PostOwnerMenu from "./PostOwnerMenu.js";

class IglooPostInteractions implements PostInteractions<IglooPost> {
  public openPostView(postId: number) {
    Router.go(`/post/${postId}`);
  }

  public openAuthorProfile(author: Author) {
    Router.go(`/${author.x_username}`, undefined, author);
  }

  public openOwnerMenu(postId: number, rect: DOMRect) {
    new PostOwnerMenu(postId, {
      left: rect.right - 160,
      top: rect.top,
    });
  }

  public openCommentPopup(post: IglooPost) {
    new PostCommentPopup(post);
  }

  public async repost(postId: number) {
    await IglooPostService.repost(postId);
  }

  public async unrepost(postId: number) {
    await IglooPostService.unrepost(postId);
  }

  public async like(postId: number) {
    await IglooPostService.like(postId);
  }

  public async unlike(postId: number) {
    await IglooPostService.unlike(postId);
  }
}

export default new IglooPostInteractions();
