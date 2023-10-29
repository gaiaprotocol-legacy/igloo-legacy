import { getNetwork, getWalletClient } from "@wagmi/core";
import { Confirm, ErrorAlert, EventContainer } from "common-app-module";
import { BaseContract, Interface, InterfaceAbi, ethers } from "ethers";
import EnvironmentManager from "../EnvironmentManager.js";
import SignedUserManager from "../user/SignedUserManager.js";
import SwitchToAvaxPopup from "../user/SwitchToAvaxPopup.js";
import WalletManager from "../user/WalletManager.js";

export default abstract class Contract<CT extends BaseContract>
  extends EventContainer {
  protected viewContract!: CT;

  public address!: string;

  constructor(private abi: Interface | InterfaceAbi) {
    super();
  }

  public init(address: string) {
    this.address = address;

    this.viewContract = new ethers.Contract(
      this.address,
      this.abi,
      new ethers.JsonRpcProvider(EnvironmentManager.avaxRpc),
    ) as any;
  }

  protected async getWriteContract(): Promise<CT | undefined> {
    if (!SignedUserManager.signed) {
      new Confirm({
        title: "Not signed in",
        message: "You need to sign in to perform this action",
        confirmTitle: "Sign in",
      }, () => SignedUserManager.signIn());
      return;
    }

    if (WalletManager.connected !== true) {
      await WalletManager.connect();
    }

    const walletClient = await getWalletClient();
    if (!walletClient) {
      new ErrorAlert({
        title: "No wallet connected",
        message: "You need to connect a wallet to perform this action",
      });
      return;
    }

    if (!SignedUserManager.walletAddress) {
      new Confirm({
        title: "No wallet linked",
        message: "You need to link a wallet to perform this action",
        confirmTitle: "Link wallet",
      }, () => SignedUserManager.linkWallet());
      return;
    }

    const { account } = walletClient;
    if (account.address !== SignedUserManager.walletAddress) {
      new ErrorAlert({
        title: "Wallet address mismatch",
        message:
          "The wallet address associated with your account and the current crypto wallet address do not match. Please change the crypto wallet address.",
      });
      return;
    }

    const { chain } = getNetwork();
    if (!chain) {
      new ErrorAlert({
        title: "Invalid network",
        message:
          "You need to be on the Avalanche network to perform this action",
      });
      return;
    }

    if (chain.id !== EnvironmentManager.avaxChainId) {
      new SwitchToAvaxPopup();
      return;
    }

    const signer = await SignedUserManager.getContractSigner();
    if (signer) {
      return new ethers.Contract(
        this.address,
        this.abi,
        signer,
      ) as any;
    }
  }
}
