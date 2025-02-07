import { useWriteContract } from "wagmi";
import { ChainWorkBenchABI } from "./contract/eth/ChainWorkBench";
import { useContractAddress } from "./contract/use-contract-address";

export function useLevelUp() {
  const { address: ContractAddress } = useContractAddress("ethereum");

  const {
    writeContract,
    data,
    isPending: isLoading,
    isError,
    isSuccess,
    error,
  } = useWriteContract();

  function levelUpAction() {
    writeContract({
      address: ContractAddress as `0x${string}`,
      abi: ChainWorkBenchABI,
      functionName: "claim",
    });
  }

  if (error) {
    console.log(error);
  }

  return {
    data,
    write: levelUpAction,
    isPending: isLoading,
    isError,
    isSuccess,
  };
}
