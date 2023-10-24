import {
  Confirm,
  DomNode,
  DropdownMenu,
  el,
  MaterialIcon,
  Router,
} from "common-dapp-module";
import Post from "../database-interface/Post.js";
import SignedUserManager from "../user/SignedUserManager.js";
import PostCacher from "./PostCacher.js";
import PostCommentPopup from "./PostCommentPopup.js";
import PostService from "./PostService.js";

export default class PostListItem extends DomNode {
  private repostCountDisplay!: DomNode;
  private likeCountDisplay!: DomNode;

  constructor(private post: Post) {
    super(".post-list-item");
    this.onDom("click", () => Router.go(`/post/${post.id}`));

    this.render();
    this.onDelegate(PostCacher, "update", (updatedPost: Post) => {
      if (updatedPost.id === this.post.id) {
        this.post = updatedPost;
        this.render();
      }
    });
    this.onDelegate(PostCacher, "delete", (id: number) => {
      if (id === this.post.id) {
        this.delete();
      }
    });

    this.checkSigned();
    this.onDelegate(SignedUserManager, "userFetched", () => this.checkSigned());
  }

  private render() {
    this.empty().append(
      el(".author-profile-image", {
        style: { backgroundImage: `url(${this.post.author_avatar_url})` },
        click: (event) => this.goAuthorProfile(event),
      }),
      el(
        "main",
        el(
          "header",
          el(
            ".author",
            el(".name", this.post.author_name, {
              click: (event) => this.goAuthorProfile(event),
            }),
            this.post.author_x_username
              ? el(".x-username", `@${this.post.author_x_username}`, {
                click: (event) => this.goAuthorProfile(event),
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
                    }, () => PostService.deletePost(this.post.id));
                  },
                }],
              });
            },
          }),
        ),
        el("p.message", this.post.message),
        el(
          ".actions",
          el(
            "button.comment",
            new MaterialIcon("comment"),
            String(this.post.comment_count),
            {
              click: (event) => {
                event.stopPropagation();
                new PostCommentPopup(this.post);
              },
            },
          ),
          el(
            "button.repost",
            new MaterialIcon("repeat"),
            this.repostCountDisplay = el(
              "span",
              String(this.post.repost_count),
            ),
            {
              click: (event) => {
                event.stopPropagation();
                PostService.repost(this.post.id);
                this.repostCountDisplay.text = String(
                  this.post.repost_count + 1,
                );
              },
            },
          ),
          el(
            "button.like",
            new MaterialIcon("favorite_border"),
            this.likeCountDisplay = el(
              "span",
              String(this.post.like_count),
            ),
            {
              click: (event) => {
                event.stopPropagation();
                PostService.like(this.post.id);
                this.likeCountDisplay.text = String(this.post.like_count + 1);
              },
            },
          ),
        ),
      ),
    );
  }

  private checkSigned() {
    if (this.post.author === SignedUserManager.userId) {
      this.addClass("owned");
    }
  }

  private goAuthorProfile(event: MouseEvent) {
    event.stopPropagation();
    Router.go(`/${this.post.author_x_username}`);
  }
}
