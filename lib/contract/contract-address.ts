import { isProduction } from "../api/path";
import { IChain } from "@/lib/const/chain";
import Mainnet from "./mainnet.json";
import Testnet from "./testnet.json";

const ChainNameMap = {
  Ethereum: "ethereum",
  Solana: "solana",
  OP: "op",
  Linea: "linea",
} as const;

export function getWorkBenchAddress(
  chainName: IChain["name"],
  isV2: boolean = false,
) {
  const contracts = getChainAddress(chainName);
  const contractName = isV2 ? `work-bench-v2` : `work-bench`;

  return (contracts as any)[contractName];
}

export function getKinkoAddress(chainName: IChain["name"]): any {
  const contracts = getChainAddress(chainName);
  return (contracts as any)["kinko"];
}

export function getChainAddress(chainName: IChain["name"]): any {
  const cName = ChainNameMap[chainName as keyof typeof ChainNameMap];
  const contracts = isProduction ? Mainnet[cName] : Testnet[cName];

  return contracts;
}
