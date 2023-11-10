import { EventContainer, Supabase } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import IglooUserCacher from "./IglooUserCacher.js";
import IglooUserService from "./IglooUserService.js";

class SignedUserManager extends EventContainer {
  public user: SoFiUserPublic | undefined;

  public get signed() {
    return this.user !== undefined;
  }

  public async fetchUserOnInit() {
    const { data, error } = await Supabase.client.auth.getSession();
    if (error) throw error;
    const sessionUser = data?.session?.user;
    if (sessionUser) {
      this.user = await IglooUserService.fetchUser(sessionUser.id);
      if (this.user) IglooUserCacher.cache(this.user);
    }
  }

  public async signIn() {
    await Supabase.signIn("twitter");
  }

  public async signOut() {
    await Supabase.signOut();
    location.reload();
  }
}

export default new SignedUserManager();
