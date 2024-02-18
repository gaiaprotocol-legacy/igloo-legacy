import {
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  optimism,
  optimismGoerli,
} from "npm:viem/chains";
import { isDevMode } from "./supabase.ts";

export enum BlockchainType {
  Base = "base",
  Arbitrum = "arbitrum",
  Optimism = "optimism",
  Avalanche = "avalanche",
}

export const rpcs: { [chain: string]: string } = {
  [BlockchainType.Base]: (isDevMode ? baseSepolia : base).rpcUrls.default
    .http[0],
  [BlockchainType.Arbitrum]:
    (isDevMode ? arbitrumGoerli : arbitrum).rpcUrls.default.http[0],
  [BlockchainType.Optimism]:
    (isDevMode ? optimismGoerli : optimism).rpcUrls.default.http[0],
  [BlockchainType.Avalanche]:
    (isDevMode ? avalanche : avalancheFuji).rpcUrls.default.http[0],
};
