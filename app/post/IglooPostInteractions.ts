import { Author, PostInteractions } from "sofi-module";

class IglooPostInteractions implements PostInteractions {
  public openPostView(postId: number) {}
  public openAuthorProfile(author: Author) {}
  public openOwnerMenu(postId: number, rect: DOMRect) {}
  public openCommentPopup(postId: number) {}
  public repost(postId: number) {}
  public unrepost(postId: number) {}
  public like(postId: number) {}
  public unlike(postId: number) {}
}

export default new IglooPostInteractions();
