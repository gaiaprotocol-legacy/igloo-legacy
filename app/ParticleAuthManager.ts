import { ParticleNetwork } from "@particle-network/auth";
import { Avalanche, AvalancheTestnet } from "@particle-network/chains";
import { ParticleProvider } from "@particle-network/provider";
import { WalletManager } from "fsesf";
import { ethers } from "ethers";
import Env from "./Env.js";

class ParticleAuthManager implements WalletManager {
  private particle!: ParticleNetwork;
  private provider!: ethers.BrowserProvider;

  public init(option: {
    projectId: string;
    clientKey: string;
    appId: string;
  }) {
    this.particle = new ParticleNetwork({
      ...option,
      chainName: Env.dev ? AvalancheTestnet.name : Avalanche.name,
      chainId: Env.dev ? AvalancheTestnet.id : Avalanche.id,
      /*wallet: { //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
        displayWalletEntry: true, //show wallet entry when connect particle.
        defaultWalletEntryPosition: WalletEntryPosition.BR, //wallet entry position
        uiMode: "dark", //optional: light or dark, if not set, the default is the same as web auth.
        supportChains: [{ id: 1, name: "Ethereum" }, { id: 5, name: "Ethereum" }], // optional: web wallet support chains.
        customStyle: {}, //optional: custom wallet style
      },
      securityAccount: { //optional: particle security account config
        //prompt set payment password. 0: None, 1: Once(default), 2: Always
        promptSettingWhenSign: 1,
        //prompt set master password. 0: None(default), 1: Once, 2: Always
        promptMasterPasswordSettingWhenLogin: 1,
      },*/
    });
    this.provider = new ethers.BrowserProvider(
      new ParticleProvider(this.particle.auth),
    );
  }

  public open() {
    this.particle.openWallet();
  }

  public async connect(): Promise<boolean> {
    await this.particle.auth.login();
    return true;
  }

  public async connected(): Promise<boolean> {
    return this.particle.auth.isLogin();
  }

  public async getAddress(): Promise<string | undefined> {
    try {
      const signer = (await this.provider.listAccounts())[0];
      return await signer.getAddress();
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  public async getChainId(): Promise<number | undefined> {
    const { chainId } = await this.provider.getNetwork();
    return Number(chainId);
  }

  public async signMessage(message: string): Promise<string> {
    return await (await this.getSigner()).signMessage(message);
  }

  public async switchChain(chainId: number): Promise<void> {
    if (chainId === Avalanche.id) {
      await this.particle.switchChain(Avalanche);
    } else if (chainId === AvalancheTestnet.id) {
      await this.particle.switchChain(AvalancheTestnet);
    } else {
      throw new Error("Unsupported chain");
    }
  }

  public async getSigner(): Promise<ethers.JsonRpcSigner> {
    return this.provider.getSigner();
  }
}

export default new ParticleAuthManager();
