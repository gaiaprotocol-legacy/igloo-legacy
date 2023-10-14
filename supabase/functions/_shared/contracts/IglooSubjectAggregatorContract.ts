import { ethers } from "https://esm.sh/ethers@6.7.0";
import Contract from "./Contract.ts";
import IglooSubjectAggregatorArtifact from "./abi/igloo/IglooSubjectAggregator.json" assert {
  type: "json"
};
import { IglooSubjectAggregator } from "./abi/igloo/IglooSubjectAggregator.ts";

export default class IglooSubjectAggregatorContract
  extends Contract<IglooSubjectAggregator> {
  constructor(signer: ethers.Signer) {
    super(
      Deno.env.get("IGLOO_SUBJECT_AGGREGATOR_ADDRESS")!,
      IglooSubjectAggregatorArtifact.abi,
      signer,
    );
  }

  public async getBulkKeyPrices(subjects: string[]) {
    return await this.ethersContract.getBulkKeyPrices(subjects);
  }

  public async getBulkKeyBalances(holder: string, subjects: string[]) {
    return await this.ethersContract.getBulkKeyBalances(holder, subjects);
  }
}
