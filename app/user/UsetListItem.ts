import { DomNode, el, Router } from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";
import UserDetailsCacher from "./UserDetailsCacher.js";

export default class UserListItem extends DomNode {
  constructor(private userDetails: UserDetails) {
    super(".user-list-item");

    this.render();
    this.onDelegate(UserDetailsCacher, "update", (userDetails: UserDetails) => {
      if (userDetails.user_id === this.userDetails.user_id) {
        this.userDetails = userDetails;
        this.render();
      }
    });
  }

  private render() {
    this.empty().append(
      el(".profile-image", {
        style: { backgroundImage: `url(${this.userDetails.profile_image})` },
        click: (event) => this.goAuthorProfile(event),
      }),
      el(
        ".info",
        el(".name", this.userDetails.display_name, {
          click: (event) => this.goAuthorProfile(event),
        }),
        this.userDetails.x_username
          ? el(".x-username", `@${this.userDetails.x_username}`, {
            click: (event) => this.goAuthorProfile(event),
          })
          : undefined,
      ),
    );
  }

  private goAuthorProfile(event: MouseEvent) {
    event.stopPropagation();
    Router.go(`/${this.userDetails.x_username}`);
  }
}
