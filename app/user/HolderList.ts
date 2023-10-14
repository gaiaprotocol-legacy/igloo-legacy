import UserList from "./UsetList.js";

export default class HolderList extends UserList {
  constructor(private userId: string) {
    super(".holder-list", "No holders yet");
  }

  protected async fetchContent() {
    //TODO:
  }
}
