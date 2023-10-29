import Contract from "./Contract.js";
import { IglooSubject } from "./abi/igloo/IglooSubject.js";
import IglooSubjectArtifact from "./abi/igloo/IglooSubject.json" assert {
  type: "json",
};

class IglooSubjectContract extends Contract<IglooSubject> {
  constructor() {
    super(IglooSubjectArtifact.abi);
  }

  public async getBuyPrice(subject: string, amount: bigint) {
    return this.viewContract.getBuyPrice(subject, amount);
  }

  public async getSellPrice(subject: string, amount: bigint) {
    return this.viewContract.getSellPrice(subject, amount);
  }

  public async getBuyPriceAfterFee(subject: string, amount: bigint) {
    return this.viewContract.getBuyPriceAfterFee(subject, amount);
  }

  public async getSellPriceAfterFee(subject: string, amount: bigint) {
    return this.viewContract.getSellPriceAfterFee(subject, amount);
  }

  public async getKeysBalance(subject: string, walletAddress: string) {
    return this.viewContract.keysBalance(subject, walletAddress);
  }

  public async buyKeys(subject: string, amount: bigint, value: bigint) {
    const writeContract = await this.getWriteContract();
    if (!writeContract) {
      throw new Error("No signer");
    }
    const tx = await writeContract.buyKeys(subject, amount, { value });
    return tx.wait();
  }

  public async sellKeys(subject: string, amount: bigint) {
    const writeContract = await this.getWriteContract();
    if (!writeContract) {
      throw new Error("No signer");
    }
    const tx = await writeContract.sellKeys(subject, amount);
    return tx.wait();
  }
}

export default new IglooSubjectContract();
