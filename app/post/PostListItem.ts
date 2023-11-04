import {
  Confirm,
  DomNode,
  DropdownMenu,
  el,
  MaterialIcon,
  Router,
} from "common-app-module";
import dayjs from "dayjs";
import { Post, Rich } from "sofi-module";
import SignedUserManager from "../user/SignedUserManager.js";
import PostCacher from "./PostCacher.js";
import PostCommentPopup from "./PostCommentPopup.js";
import PostService from "./PostService.js";

export default class PostListItem extends DomNode {
  private repostCountDisplay!: DomNode;
  private likeCountDisplay!: DomNode;

  constructor(
    private post: Post,
    private reposted: boolean,
    private liked: boolean,
    isNew: boolean,
  ) {
    super(".post-list-item" + (isNew ? ".new" : ""));
    this.onDom("click", () => Router.go(`/post/${post.id}`));
    if (reposted) this.addClass("reposted");
    if (liked) this.addClass("liked");

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
        style: { backgroundImage: `url(${this.post.author.profile_image})` },
        click: (event) => this.goAuthorProfile(event),
      }),
      el(
        "main",
        el(
          "header",
          el(
            ".author",
            el(".name", this.post.author.display_name, {
              click: (event) => this.goAuthorProfile(event),
            }),
            this.post.author.x_username
              ? el(".x-username", `@${this.post.author.x_username}`, {
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
        !this.post.rich ? undefined : this.getRich(this.post.rich),
        el(
          ".date",
          dayjs(this.post.created_at).fromNow(),
        ),
        el(
          "footer",
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
                if (!this.reposted) {
                  PostService.repost(this.post.id);
                  this.post.repost_count += 1;
                  this.repostCountDisplay.text = String(this.post.repost_count);
                  this.reposted = true;
                  this.addClass("reposted");
                } else {
                  PostService.unrepost(this.post.id);
                  this.post.repost_count -= 1;
                  this.repostCountDisplay.text = String(this.post.repost_count);
                  this.reposted = false;
                  this.deleteClass("reposted");
                }
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
                if (!this.liked) {
                  PostService.like(this.post.id);
                  this.post.like_count += 1;
                  this.likeCountDisplay.text = String(this.post.like_count);
                  this.liked = true;
                  this.addClass("liked");
                } else {
                  PostService.unlike(this.post.id);
                  this.post.like_count -= 1;
                  this.likeCountDisplay.text = String(this.post.like_count);
                  this.liked = false;
                  this.deleteClass("liked");
                }
              },
            },
          ),
        ),
      ),
    );
  }

  private getRich(rich: Rich) {
    if (rich.files) {
      return el(
        ".files",
        ...rich.files.map((file) =>
          el(
            ".file",
            !file.url ? undefined : el(
              ".image-container",
              el(
                "a",
                el("img", { src: file.url }),
                {
                  href: file.url,
                  target: "_blank",
                  click: (event) => event.stopPropagation(),
                },
              ),
            ),
          )
        ),
      );
    }
    return undefined;
  }

  private checkSigned() {
    if (this.post.author.user_id === SignedUserManager.userId) {
      this.addClass("owned");
    }
  }

  private goAuthorProfile(event: MouseEvent) {
    event.stopPropagation();
    Router.go(`/${this.post.author.x_username}`);
  }
}
