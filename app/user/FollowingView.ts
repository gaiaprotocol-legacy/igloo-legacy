import { DomNode, el, View, ViewParams } from "common-app-module";
import UserDetails from "../database-interface/UserDetails.js";
import Layout from "../layout/Layout.js";
import MaterialIcon from "../MaterialIcon.js";
import FollowingList from "./FollowingList.js";
import UserDetailsCacher from "./UserDetailsCacher.js";

export default class FollowingView extends View {
  private container: DomNode;
  private xUsername!: string;
  private userDetails!: UserDetails;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".following-view",
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
      new FollowingList(this.userDetails.user_id).show(),
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
