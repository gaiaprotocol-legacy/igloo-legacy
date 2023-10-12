import UserList from "./UsetList.js";

export default class FollowerList extends UserList {
  constructor(private userId: string) {
    super(".follower-list");
  }

  protected async fetchContent() {
    //TODO:
  }
}
