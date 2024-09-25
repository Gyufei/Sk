import { useEffect, useState } from "react";
import Mainnet from "./mainnet.json";
import Testnet from "./testnet.json";

export function useContractAddress(
  chainName: "linea" | "ethereum" | "solana" | "op",
) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      setAddress(Mainnet[chainName]["work-bench"]);
    } else {
      // setAddress((Mainnet)[chainName]["work-bench"])
      setAddress(Testnet[chainName]["work-bench"]);
    }
  }, [chainName]);

  return {
    address,
  };
}
