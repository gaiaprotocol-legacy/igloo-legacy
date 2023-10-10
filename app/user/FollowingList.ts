import UserList from "./UsetList.js";

export default class FollowingList extends UserList {
  constructor() {
    super(".following-list");
  }

  protected async fetchContent() {
    //TODO:
  }
}
