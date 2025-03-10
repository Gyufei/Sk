import { isProduction } from "../api/path";
import Mainnet from "./mainnet.json";
import Testnet from "./testnet.json";

export type ChainName = "linea" | "ethereum" | "solana" | "op";

export function getWorkBenchAddress(
  chainName: "linea" | "ethereum" | "solana" | "op",
  isV2: boolean = false,
) {
  const contracts = getChainAddress(chainName);
  const contractName = isV2 ? `work-bench-v2` : `work-bench`;

  return (contracts as any)[contractName];
}

export function getKinkoAddress(chainName: ChainName): any {
  const contracts = getChainAddress(chainName);
  return (contracts as any)["kinko"];
}

export function getChainAddress(chainName: ChainName): any {
  const contracts = isProduction ? Mainnet[chainName] : Testnet[chainName];

  return contracts;
}
