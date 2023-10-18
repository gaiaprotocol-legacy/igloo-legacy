import UserList from "./UsetList.js";

export default class HoldingList extends UserList {
  constructor(private userId: string) {
    super(".holding-list", "No holdings");
  }

  protected async fetchContent() {
    //TODO:
  }
}
