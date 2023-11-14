import { Confirm, DropdownMenu } from "common-app-module";
import IglooPostService from "./IglooPostService.js";

export default class PostOwnerMenu extends DropdownMenu {
  constructor(postId: number, options: {
    left: number;
    top: number;
  }) {
    super({
      left: options.left,
      top: options.top,
      items: [{
        title: "Delete",
        click: () => {
          new Confirm({
            title: "Delete Post",
            message: "Are you sure you want to delete this post?",
            confirmTitle: "Delete",
            loadingTitle: "Deleting...",
          }, () => IglooPostService.deletePost(postId));
        },
      }],
    });
  }
}
