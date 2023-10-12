import Contract from "./Contract.js";
import { IglooSubject } from "./abi/igloo/IglooSubject.js";
import IglooSubjectArtifact from "./abi/igloo/IglooSubject.json" assert {
    type: "json"
};

class IglooSubjectContract extends Contract<IglooSubject> {
  constructor() {
    super(IglooSubjectArtifact.abi);
  }

  public async getBuyPrice(tokenAddress: string, amount: bigint) {
    return this.viewContract.getBuyPrice(tokenAddress, amount);
  }

  public async getSellPrice(tokenAddress: string, amount: bigint) {
    return this.viewContract.getSellPrice(tokenAddress, amount);
  }

  public async getBuyPriceAfterFee(tokenAddress: string, amount: bigint) {
    return this.viewContract.getBuyPriceAfterFee(tokenAddress, amount);
  }

  public async getSellPriceAfterFee(tokenAddress: string, amount: bigint) {
    return this.viewContract.getSellPriceAfterFee(tokenAddress, amount);
  }

  public async buyKeys(subject: string, amount: bigint) {
    const writeContract = await this.getWriteContract();
    if (!writeContract) {
      throw new Error("No signer");
    }
    const tx = await writeContract.buyKeys(subject, amount, {
      value: await this.getBuyPriceAfterFee(subject, amount),
    });
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
