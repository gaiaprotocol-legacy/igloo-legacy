import UserService from "../user/UserService.js";
import UserList from "../user/UsetList.js";

export default class SearchResultUserList extends UserList {
  constructor() {
    super(".search-result-user-list", "No results found");
  }

  protected async fetchContent() {}

  public async searchUsers(query: string) {
    const userDetailsSet = await UserService.searchUsers(query);
    if (!this.deleted) {
      this.empty();
      if (userDetailsSet.length === 0) {
        this.showEmptyMessage();
      } else {
        for (const userDetails of userDetailsSet) {
          this.addUserDetails(userDetails);
        }
      }
    }
  }
}
