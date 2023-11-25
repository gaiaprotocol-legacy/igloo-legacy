import { msg, Router, Snackbar } from "common-app-module";
import { PostForm } from "sofi-module";
import IglooPost, { PostTarget } from "../database-interface/IglooPost.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
import IglooPostService from "./IglooPostService.js";

export default class IglooPostForm extends PostForm {
  public target: number = PostTarget.EVERYONE;

  constructor(
    private parentPostId: number | undefined,
    focus: boolean,
    private callback: (post: IglooPost) => void,
  ) {
    super(IglooSignedUserManager.user?.profile_image_thumbnail ?? "", focus);
  }

  protected async post(message: string, files: File[]): Promise<void> {
    const post = !this.parentPostId
      ? await IglooPostService.post(this.target, message, files)
      : await IglooPostService.comment(this.parentPostId, message, files);

    new Snackbar({
      message: msg("post-form-posted-snackbar-message"),
      action: {
        title: msg("post-form-posted-snackbar-button"),
        click: () => Router.go(`/post/${post.id}`),
      },
    });

    this.callback(post);
  }
}
