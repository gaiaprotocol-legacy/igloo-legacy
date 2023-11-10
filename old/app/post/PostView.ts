import {
  DomNode,
  el,
  SingletonTempCacher,
  Supabase,
  View,
  ViewParams,
} from "common-app-module";
import { Author, Post, PostInteractions, PostThread } from "sofi-module";
import Layout from "../layout/Layout.js";
import SignedUserManager from "../user/SignedUserManager.js";
import IglooPostForm from "./IglooPostForm.js";

export default class PostView extends View {
  private container: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".post-view",
      ),
    );
    this.fetchPost(parseInt(params.postId!));
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.fetchPost(parseInt(params.postId!));
  }

  private get form() {
    if (SignedUserManager.avatarUrl) {
      return new IglooPostForm(SignedUserManager.avatarUrl);
    }
  }

  private get interactions(): PostInteractions {
    return {
      openAuthorProfile: (author: Author) => {},
      openOwnerMenu: (postId: number, rect: DOMRect) => {},
      openCommentPopup: (postId: number) => {},

      repost: (postId: number) => {},
      unrepost: (postId: number) => {},
      like: (postId: number) => {},
      unlike: (postId: number) => {},
    };
  }

  private async fetchPost(postId: number) {
    let posts = SingletonTempCacher.get<Post[]>(`post-view-data-${postId}`) ??
      [];
    new PostThread(
      posts,
      {
        mainPostId: postId,
        repostedPostIds: [],
        likedPostIds: [],
        newPostIds: [],
        signedUserId: SignedUserManager.userId,
      },
      this.interactions,
      this.form,
    ).appendTo(this.container);

    const { data, error } = await Supabase.client.rpc("get_post_and_comments", {
      p_post_id: postId,
    });
    if (error) throw error;

    const newPostIds = data.filter((post: Post) =>
      !posts.some((existingPost) => existingPost.id === post.id)
    )
      .map((newPost: Post) => newPost.id);

    posts = data;
    SingletonTempCacher.cache(`post-view-data-${postId}`, posts);
    new PostThread(
      posts,
      {
        mainPostId: postId,
        repostedPostIds: [],
        likedPostIds: [],
        newPostIds,
        signedUserId: SignedUserManager.userId,
      },
      this.interactions,
      this.form,
    ).appendTo(this.container);
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
