import UserList from "./UsetList.js";

export default class HolderList extends UserList {
  constructor(private userId: string) {
    super(".holder-list");
  }

  protected async fetchContent() {
    //TODO:
  }
}
