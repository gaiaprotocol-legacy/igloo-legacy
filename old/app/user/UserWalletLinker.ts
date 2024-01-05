import { Supabase } from "@common-module/app";
import SignedUserManager from "./SignedUserManager.js";
import UserDetailsCacher from "./UserDetailsCacher.js";
import WalletManager from "./WalletManager.js";

class UserWalletLinker {
  private messageForWalletLinking!: string;

  public init(messageForWalletLinking: string) {
    this.messageForWalletLinking = messageForWalletLinking;
  }

  public async link() {
    const walletAddress = WalletManager.address;
    if (!walletAddress) throw new Error("Wallet is not connected");

    const { data: nonceData, error: nonceError } = await Supabase.client
      .functions.invoke("new-wallet-linking-nonce", {
        body: { walletAddress },
      });
    if (nonceError) throw nonceError;

    const signedMessage = await WalletManager.signMessage(
      `${this.messageForWalletLinking}\n\nNonce: ${nonceData.nonce}`,
    );

    const { error: linkError } = await Supabase.client.functions
      .invoke(
        "link-wallet-to-user",
        { body: { walletAddress, signedMessage } },
      );
    if (linkError) throw linkError;

    if (SignedUserManager.userId) {
      UserDetailsCacher.refresh(SignedUserManager.userId);
    }
  }
}

export default new UserWalletLinker();
