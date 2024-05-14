import { useContractWrite } from "wagmi";
import { ChainWorkBenchABI } from "./contract/eth/ChainWorkBench";
import { useContractAddress } from "./contract/use-contract-address";

export function useEthClaim(chainName: 'linea' | 'ethereum') {
  const ContractAddress = useContractAddress(chainName);

  const { write, data, isLoading, isError, isSuccess, error } = useContractWrite({
    address: ContractAddress as `0x${string}`,
    abi: ChainWorkBenchABI.abi,
    functionName: 'claim',
  })

  function claimAction (amount: number, proofs: string[]) {
    write({
      args: [amount, proofs],
    })
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
  }
}
