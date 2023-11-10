import { EventContainer, Supabase, UserPublic } from "common-app-module";
import IglooUserService from "./IglooUserService.js";

class SignedUserManager extends EventContainer {
  public user: UserPublic | undefined;

  public async fetchUserOnInit() {
    const { data, error } = await Supabase.client.auth.getSession();
    if (error) throw error;
    const sessionUser = data?.session?.user;
    if (sessionUser) {
      this.user = await IglooUserService.fetchUser(sessionUser.id);
    }
  }
}

export default new SignedUserManager();
