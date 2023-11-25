import { Supabase } from "common-app-module";
import { SignedUserManager } from "sofi-module";
import EnvironmentManager from "../EnvironmentManager.js";
import WalletManager from "../wallet/WalletManager.js";
import IglooUserCacher from "./IglooUserCacher.js";
import IglooUserService from "./IglooUserService.js";

class IglooSignedUserManager extends SignedUserManager {
  protected async fetchUser(userId: string) {
    const user = await IglooUserService.fetchUser(userId);
    if (user) IglooUserCacher.cache(user);
    return user;
  }

  public async signIn() {
    await Supabase.signIn("twitter");
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

export default new IglooSignedUserManager();
