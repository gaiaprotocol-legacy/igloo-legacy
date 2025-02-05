import { ethers } from "ethers";
import EnvironmentManager from "./EnvironmentManager.js";

class BlockTimeCacher {
  private blockNumber!: number;
  private blockTime!: number;

  public async init() {
    const provider = new ethers.JsonRpcProvider(EnvironmentManager.avaxRpc);
    const block = await provider.getBlock("latest");
    this.blockNumber = block!.number;
    this.blockTime = block!.timestamp * 1000;
  }

  public blockToTime(blockNumber: number): number {
    // avax chain (2s block time)
    return this.blockTime + (blockNumber - this.blockNumber) * 2 * 1000;
  }
}

export default new BlockTimeCacher();
