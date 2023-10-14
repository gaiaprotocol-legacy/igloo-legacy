import { ethers } from "https://esm.sh/ethers@6.7.0";
import Contract from "./Contract.ts";
import IglooSubjectArtifact from "./abi/igloo/IglooSubject.json" assert {
  type: "json",
};
import { IglooSubject } from "./abi/igloo/IglooSubject.ts";

export default class IglooSubjectContract extends Contract<IglooSubject> {
  constructor(signer: ethers.Signer) {
    super(
      Deno.env.get("IGLOO_SUBJECT_ADDRESS")!,
      IglooSubjectArtifact.abi,
      signer,
    );
  }

  public async getTradeEvents(startBlock: number, endBlock: number) {
    return await this.ethersContract.queryFilter(
      this.ethersContract.filters.Trade(),
      startBlock,
      endBlock,
    );
  }
}
