import {
  DomNode,
  el,
  ListLoadingBar,
  View,
  ViewParams,
} from "common-app-module";
import { PostThread } from "sofi-module";
import IglooPost from "../database-interface/IglooPost.js";
import Layout from "../layout/Layout.js";
import MaterialIcon from "../MaterialIcon.js";
import SignedUserManager from "../user/SignedUserManager.js";
import IglooPostForm from "./IglooPostForm.js";
import IglooPostInteractions from "./IglooPostInteractions.js";
import IglooPostService from "./IglooPostService.js";
import IglooTempPostCacher from "./IglooTempPostCacher.js";

export default class PostView extends View {
  private postContainer: DomNode;
  private lastCommentId: number | undefined;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".post-view",
        el(
          "header",
          el("button", new MaterialIcon("arrow_back"), {
            click: () => history.back(),
          }),
          el("h1", "Post"),
        ),
        this.postContainer = el(".post-container"),
      ),
    );
    this.load(parseInt(params.postId!));
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.load(parseInt(params.postId!));
  }

  private async load(mainPostId: number) {
    const cached = IglooTempPostCacher.get(mainPostId) ?? {
      posts: [],
      repostedPostIds: [],
      likedPostIds: [],
    };

    this.render(
      mainPostId,
      cached.posts,
      cached.repostedPostIds,
      cached.likedPostIds,
      [],
      mainPostId,
    );
    this.postContainer.append(new ListLoadingBar());

    const result = await IglooPostService.fetchPost(
      mainPostId,
      SignedUserManager.user?.user_id,
    );
    IglooTempPostCacher.cache(mainPostId, result);

    const newPostIds = result.posts.filter((post) =>
      !cached.posts.some((existingPost) => existingPost.id === post.id)
    ).map((newPost) => newPost.id);

    this.postContainer.empty();
    this.render(
      mainPostId,
      result.posts,
      result.repostedPostIds,
      result.likedPostIds,
      newPostIds,
      mainPostId,
    );

    this.lastCommentId = result.posts[result.posts.length - 1]?.id;
  }

  private async loadMore() {
    //TODO: implement
  }

  private addNewPost(mainPostId: number, newPost: IglooPost) {
    const cached = IglooTempPostCacher.get(mainPostId) ?? {
      posts: [],
      repostedPostIds: [],
      likedPostIds: [],
    };
    cached.posts.push(newPost);
    IglooTempPostCacher.cache(mainPostId, cached);

    this.postContainer.empty();
    this.render(
      mainPostId,
      cached.posts,
      cached.repostedPostIds,
      cached.likedPostIds,
      [newPost.id],
      newPost.id,
    );
  }

  private render(
    mainPostId: number,
    posts: IglooPost[],
    repostedPostIds: number[],
    likedPostIds: number[],
    newPostIds: number[],
    scrollToPostId: number,
  ) {
    const thread = new PostThread(
      posts,
      {
        inView: true,
        mainPostId,
        repostedPostIds,
        likedPostIds,
        newPostIds,
        signedUserId: SignedUserManager.user?.user_id,
      },
      IglooPostInteractions,
      new IglooPostForm(
        mainPostId,
        false,
        (newPost) => this.addNewPost(mainPostId, newPost),
      ),
    ).appendTo(this.postContainer);

    const scrollToPost = thread.findPostDisplay(scrollToPostId);
    scrollToPost?.domElement.scrollIntoView();
  }
}
