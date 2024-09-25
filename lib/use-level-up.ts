import { useContractWrite } from "wagmi";
import { ChainWorkBenchABI } from "./contract/eth/ChainWorkBench";
import { useContractAddress } from "./contract/use-contract-address";

export function useLevelUp() {
  const { address: ContractAddress } = useContractAddress("ethereum");

  const { write, data, isLoading, isError, isSuccess, error } =
    useContractWrite({
      address: ContractAddress as `0x${string}`,
      abi: ChainWorkBenchABI.abi,
      functionName: "claim",
    });

  function levelUpAction() {
    write({});
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
