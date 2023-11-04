import {
  Button,
  Confirm,
  DomNode,
  DropdownMenu,
  el,
  MaterialIcon,
  Router,
  Snackbar,
  Supabase,
  View,
  ViewParams,
} from "common-app-module";
import { Post, UploadedFile } from "sofi-module";
import Layout from "../layout/Layout.js";
import SignedUserManager from "../user/SignedUserManager.js";
import PostCacher from "./PostCacher.js";
import PostCommentList from "./PostCommentList.js";
import PostCommentPopup from "./PostCommentPopup.js";
import PostService from "./PostService.js";

export default class PostView extends View {
  private container: DomNode;
  private postContainer: DomNode;
  private commentContainer: DomNode;

  private commentTextarea: DomNode<HTMLTextAreaElement>;
  private uploadInput: DomNode<HTMLInputElement>;
  private uploadButton: DomNode<HTMLButtonElement>;
  private commentButton: Button;
  private repostCountDisplay!: DomNode;
  private likeCountDisplay!: DomNode;

  private post: Post | undefined;
  private uploadedFile: UploadedFile | undefined;
  private reposted: boolean = false;
  private liked: boolean = false;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".post-view",
        this.postContainer = el(".post-container"),
        el(
          ".form-wrapper",
          el(".signed-user", {
            style: { backgroundImage: `url(${SignedUserManager.avatarUrl})` },
          }),
          el(
            ".form",
            el(
              "main",
              this.commentTextarea = el("textarea", {
                placeholder: "What's on your mind?",
              }),
            ),
            el(
              "footer",
              this.uploadInput = el("input.upload", {
                type: "file",
                accept: "image/*",
                change: (event) => {
                  const file = event.target.files?.[0];
                  if (file) this.upload(file);
                },
              }),
              this.uploadButton = el(
                "button.upload",
                new MaterialIcon("image"),
                { click: () => this.uploadInput.domElement.click() },
              ),
              this.commentButton = new Button({
                tag: ".post-button",
                click: () => this.postComment(),
                title: "Post",
              }),
            ),
          ),
        ),
        this.commentContainer = el(".comment-container"),
      ),
    );
    this.renderPost(parseInt(params.postId!));

    this.checkSigned();
    this.container.onDelegate(
      SignedUserManager,
      "userFetched",
      () => this.checkSigned(),
    );

    this.test();
  }

  private async test() {
    const { data, error } = await Supabase.client.rpc("get_post_and_comments", {
      p_post_id: 15506,
    });
    if (error) throw error;
    console.log(data);
  }

  private checkSigned() {
    if (SignedUserManager.signed) this.container.addClass("signed");
    if (this.post?.author.user_id === SignedUserManager.userId) {
      this.container.addClass("owned");
    }
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.renderPost(parseInt(params.postId!));
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
    this.checkRepost();
    this.checkLike();
  }

  private async checkRepost() {
    if (
      this.post && SignedUserManager.userId &&
      await PostService.checkRepost(this.post.id, SignedUserManager.userId)
    ) {
      this.reposted = true;
      this.container.addClass("reposted");
    } else {
      this.reposted = false;
      this.container.deleteClass("reposted");
    }
  }

  private async checkLike() {
    if (
      this.post && SignedUserManager.userId &&
      await PostService.checkLike(this.post.id, SignedUserManager.userId)
    ) {
      this.liked = true;
      this.container.addClass("liked");
    } else {
      this.liked = false;
      this.container.deleteClass("liked");
    }
  }

  private render() {
    this.postContainer.empty().append(
      el(
        "header",
        el("button", new MaterialIcon("arrow_back"), {
          click: () => history.back(),
        }),
        el("h1", "Post"),
      ),
    );
    this.commentContainer.empty();

    if (!this.post) {
      this.postContainer.append(
        el("main", el("p.empty-message", "Post not found")),
      );
    } else {
      this.postContainer.append(
        el(
          "main",
          el(
            "header",
            el(".author-profile-image", {
              style: {
                backgroundImage: `url(${this.post.author.profile_image})`,
              },
              click: () => Router.go(`/${this.post?.author.x_username}`),
            }),
            el(
              ".author",
              el(".name", this.post.author.display_name, {
                click: () => Router.go(`/${this.post?.author.x_username}`),
              }),
              this.post.author.x_username
                ? el(".x-username", `@${this.post.author.x_username}`, {
                  click: () => Router.go(`/${this.post?.author.x_username}`),
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
                      }, async () => {
                        if (this.post) {
                          await PostService.deletePost(this.post.id);
                          history.back();
                        }
                      });
                    },
                  }],
                });
              },
            }),
          ),
          el("p.message", this.post.message),
          !this.post.rich ? undefined : this.getRich(this.post.rich),
          el(
            ".actions",
            el(
              "button.comment",
              new MaterialIcon("comment"),
              String(this.post.comment_count),
              {
                click: () => {
                  if (this.post) new PostCommentPopup(this.post);
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
                click: () => {
                  if (this.post) {
                    if (!this.reposted) {
                      PostService.repost(this.post.id);
                      this.post.repost_count += 1;
                      this.repostCountDisplay.text = String(
                        this.post.repost_count,
                      );
                      this.reposted = true;
                      this.container.addClass("reposted");
                    } else {
                      PostService.unrepost(this.post.id);
                      this.post.repost_count -= 1;
                      this.repostCountDisplay.text = String(
                        this.post.repost_count,
                      );
                      this.reposted = false;
                      this.container.deleteClass("reposted");
                    }
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
                click: () => {
                  if (this.post) {
                    if (!this.liked) {
                      PostService.like(this.post.id);
                      this.post.like_count += 1;
                      this.likeCountDisplay.text = String(this.post.like_count);
                      this.liked = true;
                      this.container.addClass("liked");
                    } else {
                      PostService.unlike(this.post.id);
                      this.post.like_count -= 1;
                      this.likeCountDisplay.text = String(this.post.like_count);
                      this.liked = false;
                      this.container.deleteClass("liked");
                    }
                  }
                },
              },
            ),
          ),
        ),
      );
      this.commentContainer.append(
        new PostCommentList(this.post.id).show(),
      );
    }
  }

  private getRich(rich: { files?: UploadedFile[] }) {
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

  private async upload(file: File) {
    this.uploadButton.domElement.disabled = true;
    this.uploadButton.empty().addClass("loading");

    try {
      this.uploadedFile = await PostService.upload(file);
      this.uploadButton.empty().append(el("img", {
        src: this.uploadedFile.url,
      }));
    } catch (error) {
      console.error(error);
      this.uploadButton.empty().append(new MaterialIcon("image"));
    }

    this.uploadInput.domElement.value = "";
    this.uploadButton.domElement.disabled = false;
    this.uploadButton.deleteClass("loading");
  }

  private async postComment() {
    if (this.post) {
      this.commentButton.disable().text = "Posting...";
      try {
        await PostService.comment(
          this.post.id,
          this.commentTextarea.domElement.value,
          this.uploadedFile,
        );
        new Snackbar({
          message: "Your post has been successfully published.",
        });
        this.commentTextarea.domElement.value = "";
        this.uploadButton.empty().append(new MaterialIcon("image"));
      } catch (error) {
        console.error(error);
      }
      this.commentButton.enable().text = "Post";
    }
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
