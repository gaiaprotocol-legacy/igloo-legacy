import {
  Confirm,
  DomNode,
  DropdownMenu,
  el,
  MaterialIcon,
  Router,
  View,
  ViewParams,
} from "common-dapp-module";
import Post from "../database-interface/Post.js";
import Layout from "../layout/Layout.js";
import SignedUserManager from "../user/SignedUserManager.js";
import PostCacher from "./PostCacher.js";
import PostService from "./PostService.js";

export default class PostView extends View {
  private container: DomNode;

  private post: Post | undefined;

  constructor(params: ViewParams) {
    super();

    Layout.append(
      this.container = el(
        ".post-view",
      ),
    );

    this.renderPost(parseInt(params.postId!));

    this.checkSigned();
    this.container.onDelegate(
      SignedUserManager,
      "userFetched",
      () => this.checkSigned(),
    );
  }

  private renderPost(postId: number) {
    this.container.offDelegate(PostCacher);
    this.post = PostCacher.getAndRefresh(postId);
    this.render();
    this.container.onDelegate(PostCacher, "update", (updatedPost: Post) => {
      if (this.post && updatedPost.id === this.post.id) {
        this.post = updatedPost;
        this.render();
      }
    });
  }

  private render() {
    this.container.empty().append(
      el(
        "header",
        el("button", new MaterialIcon("arrow_back"), {
          click: () => history.back(),
        }),
        el("h1", "Post"),
      ),
    );

    if (!this.post) {
      this.container.append(
        el("main", el("p.empty-message", "Post not found")),
      );
    } else {
      this.container.append(
        el(
          "main",
          el(
            "header",
            el(".author-profile-image", {
              style: {
                backgroundImage: `url(${this.post.author_avatar_url})`,
              },
              click: () => Router.go(`/${this.post?.author_x_username}`),
            }),
            el(
              ".author",
              el(".name", this.post.author_name, {
                click: () => Router.go(`/${this.post?.author_x_username}`),
              }),
              this.post.author_x_username
                ? el(".x-username", `@${this.post.author_x_username}`, {
                  click: () => Router.go(`/${this.post?.author_x_username}`),
                })
                : undefined,
            ),
            el("button.owner-menu", new MaterialIcon("more_vert"), {
              click: (event, button) => {
                event.stopPropagation();
                const rect = button.rect;
                new DropdownMenu({
                  left: rect.right - 160,
                  top: rect.top,
                  items: [{
                    title: "Delete",
                    click: () => {
                      new Confirm({
                        title: "Delete Post",
                        message: "Are you sure you want to delete this post?",
                        confirmTitle: "Delete",
                        loadingTitle: "Deleting...",
                      }, () => {
                        if (this.post) PostService.deletePost(this.post.id);
                      });
                    },
                  }],
                });
              },
            }),
          ),
          el("p.message", this.post.message),
        ),
        el("footer"),
        //TODO:
      );
    }
  }

  private checkSigned() {
    if (this.post?.author === SignedUserManager.userId) {
      this.container.addClass("owned");
    }
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.renderPost(parseInt(params.postId!));
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
