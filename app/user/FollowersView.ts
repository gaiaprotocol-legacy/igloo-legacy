import { DomNode, el, View, ViewParams } from "common-app-module";
import UserDetails from "../database-interface/UserDetails.js";
import Layout from "../layout/Layout.js";
import MaterialIcon from "../MaterialIcon.js";
import FollowerList from "./FollowerList.js";
import UserDetailsCacher from "./UserDetailsCacher.js";

export default class FollowersView extends View {
  private container: DomNode;
  private xUsername!: string;
  private userDetails!: UserDetails;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".followers-view",
      ),
    );

    this.xUsername = params.xUsername!;
    this.render();
    this.container.onDelegate(
      UserDetailsCacher,
      "update",
      (updatedDetails: UserDetails) => {
        if (updatedDetails.x_username === this.xUsername) {
          this.userDetails = updatedDetails;
          this.render();
        }
      },
    );
  }

  private render() {
    this.userDetails = UserDetailsCacher.getAndRefreshByXUsername(
      this.xUsername,
    );
    this.container.append(
      el(
        "header",
        el("button", new MaterialIcon("arrow_back"), {
          click: () => history.back(),
        }),
        el("h1", "@" + this.xUsername),
      ),
      new FollowerList(this.userDetails.user_id).show(),
    );
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.xUsername = params.xUsername!;
    this.render();
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
