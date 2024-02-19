import { ethers } from "https://esm.sh/ethers@6.7.0";
import { BlockchainType } from "../blockchain.ts";
import Contract from "./Contract.ts";
import KeysArtifact from "./abi/Keys.json" assert {
  type: "json",
};
import { Keys } from "./abi/Keys.ts";
import { isDevMode } from "../supabase.ts";

const testnetAddresses: { [chain: string]: string } = {
  [BlockchainType.Avalanche]: "0x5f084433645A32bEaACed7Ac63A747b7d507614D",
};

const addresses: { [chain: string]: string } = {
  [BlockchainType.Avalanche]: "",
};

const testnetDeployBlockNumbers: { [chain: string]: number } = {
  [BlockchainType.Avalanche]: 30102697,
};

const deployBlockNumbers: { [chain: string]: number } = {
  [BlockchainType.Avalanche]: 0,
};

export default class KeysContract extends Contract<Keys> {
  constructor(chain: BlockchainType, signer: ethers.Signer) {
    super(
      (isDevMode ? testnetAddresses : addresses)[chain],
      KeysArtifact.abi,
      signer,
      (isDevMode ? testnetDeployBlockNumbers : deployBlockNumbers)[chain],
    );
    this.eventFilters = {
      SetProtocolFeeDestination: this.ethersContract.filters
        .SetProtocolFeeDestination(),
      SetProtocolFeePercent: this.ethersContract.filters
        .SetProtocolFeePercent(),
      SetCreatorFeePercent: this.ethersContract.filters
        .SetCreatorFeePercent(),
      SetGroupHolderFeePercent: this.ethersContract.filters
        .SetGroupHolderFeePercent(),
      SetHybridOwnerFeePercent: this.ethersContract.filters
        .SetHybridOwnerFeePercent(),
      SetHybridHolderFeePercent: this.ethersContract.filters
        .SetHybridHolderFeePercent(),
      KeyCreated: this.ethersContract.filters.KeyCreated(),
      KeyDeleted: this.ethersContract.filters.KeyDeleted(),
      ChangeKeyType: this.ethersContract.filters.ChangeKeyType(),
      ChangeKeyOwner: this.ethersContract.filters.ChangeKeyOwner(),
      Trade: this.ethersContract.filters.Trade(),
      ClaimHolderFee: this.ethersContract.filters.ClaimHolderFee(),
    };
  }
}
