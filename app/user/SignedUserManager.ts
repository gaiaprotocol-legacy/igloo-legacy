import { EventContainer, Supabase } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import EnvironmentManager from "../EnvironmentManager.js";
import WalletManager from "../wallet/WalletManager.js";
import IglooUserCacher from "./IglooUserCacher.js";
import IglooUserService from "./IglooUserService.js";

class SignedUserManager extends EventContainer {
  public user: SoFiUserPublic | undefined;

  public get signed() {
    return this.user !== undefined;
  }

  public get walletLinked() {
    return this.user?.wallet_address !== undefined;
  }

  constructor() {
    super();
    this.addAllowedEvents("walletLinked");
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

  public async linkWallet() {
    const walletAddress = WalletManager.address;
    if (!walletAddress) throw new Error("Wallet is not connected");

    const { data: nonceData, error: nonceError } = await Supabase.client
      .functions.invoke("new-wallet-linking-nonce", {
        body: { walletAddress },
      });
    if (nonceError) throw nonceError;

    const signedMessage = await WalletManager.signMessage(
      `${EnvironmentManager.messageForWalletLinking}\n\nNonce: ${nonceData.nonce}`,
    );

    const { error: linkError } = await Supabase.client.functions
      .invoke(
        "link-wallet-to-user",
        { body: { walletAddress, signedMessage } },
      );
    if (linkError) throw linkError;

    if (this.user) {
      this.user.wallet_address = walletAddress;
      IglooUserCacher.cache(this.user);
      this.fireEvent("walletLinked");
    }
  }
}

export default new SignedUserManager();
