import { useWriteContract } from "wagmi";
import { ChainWorkBenchABI } from "./abi/eth/ChainWorkBench";

const ContractAddress = '0x3A3dd3b87EC17475762Ba8c23ff93a2F53B37b6e';

export function useEthClaim() {
  const { writeContract, data, isPending, isError, isSuccess } = useWriteContract()

  function claimAction (amount: number, proofs: string[]) {
    writeContract({
      address: ContractAddress,
      abi: ChainWorkBenchABI.abi,
      functionName: 'claim',
      args: [amount, proofs],
    })
  }

  return {
    data,
    claimAction,
    isPending,
    isError,
    isSuccess,
  }
}
