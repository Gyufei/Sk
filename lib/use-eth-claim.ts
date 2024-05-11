import { useContractWrite } from "wagmi";
import { ChainWorkBenchABI } from "./abi/eth/ChainWorkBench";

const ContractAddress = '0x3A3dd3b87EC17475762Ba8c23ff93a2F53B37b6e';

export function useEthClaim() {
  const { write, data, isLoading, isError, isSuccess, error } = useContractWrite({
    address: ContractAddress,
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
