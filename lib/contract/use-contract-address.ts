import { useEffect, useState } from "react";
import Mainnet from "./mainnet.json";
import Testnet from "./testnet.json";

export type ChainName = "linea" | "ethereum" | "solana" | "op";

export function useContractAddress(
  chainName: "linea" | "ethereum" | "solana" | "op",
  isV2: boolean = false,
) {
  const [address, setAddress] = useState("");
  const contractName = isV2 ? `work-bench-v2` : `work-bench`;

  useEffect(() => {
    const contracts =
      process.env.NODE_ENV === "production"
        ? Mainnet[chainName]
        : Testnet[chainName];

    setAddress((contracts as any)[contractName]);
  }, [chainName, contractName]);

  return {
    address,
  };
}
