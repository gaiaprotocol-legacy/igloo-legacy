import { Component, Popup } from "@common-module/app";
import IglooPost from "../database-interface/IglooPost.js";

export default class PostCommentPopup extends Popup {
  constructor(parentPost: IglooPost) {
    super({ barrierDismissible: true });
    this.append(
      new Component(
        ".popup.post-comment-popup",
      ),
    );
  }
}
