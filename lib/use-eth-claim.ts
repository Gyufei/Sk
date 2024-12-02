import { useWriteContract } from "wagmi";
import { ChainWorkBenchABI } from "./contract/eth/ChainWorkBench";
import { useContractAddress } from "./contract/use-contract-address";

export function useEthClaim(chainName: "linea" | "ethereum" | "op") {
  const { address: ContractAddress } = useContractAddress(chainName);

  const { writeContract, data, isPending: isLoading, isError, isSuccess, error } =
  useWriteContract();

  function claimAction(amount: number, proofs: string[]) {
    writeContract({
      address: ContractAddress as `0x${string}`,
      abi: ChainWorkBenchABI.abi,
      functionName: "claim",
      args: [amount, proofs],
    });
  }

  if (error) {
    console.log(error);
  }

  return {
    data,
    claimAction,
    isPending: isLoading,
    isError,
    isSuccess,
  };
}
