import { msg, Router, Snackbar } from "common-app-module";
import { PostForm } from "sofi-module";
import { PostTarget } from "../database-interface/IglooPost.js";
import SignedUserManager from "../user/SignedUserManager.js";
import IglooPostService from "./IglooPostService.js";

export default class IglooPostForm extends PostForm {
  public target: number = PostTarget.EVERYONE;

  constructor(focus: boolean = false, private callback?: () => void) {
    super(SignedUserManager.user?.profile_image_thumbnail ?? "", focus);
  }

  protected async post(message: string, files: File[]): Promise<void> {
    const postId = await IglooPostService.post(this.target, message, files);
    new Snackbar({
      message: msg("post-form-posted-snackbar-message"),
      action: {
        title: msg("post-form-posted-snackbar-button"),
        click: () => Router.go(`/post/${postId}`),
      },
    });
    if (this.callback) this.callback();
  }
}
