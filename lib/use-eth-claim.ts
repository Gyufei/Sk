import { useWriteContract } from "wagmi";
import { ChainWorkBenchABI } from "./abi/eth/ChainWorkBench";

const ContractAddress = '0x3A3dd3b87EC17475762Ba8c23ff93a2F53B37b6e';
const Proof = [
  '0x15aefbe4a9f47dbbfa954ae839318757f3faa7d5d5ccf6cf096c0456f61bb7d6',
  '0x9733d117e34292340e43287edea4bdd9df69737485bd222cebed438e0eb3270d'
]

export function useEthClaim() {
  const { writeContract, data, isPending, isError, isSuccess } = useWriteContract()

  function claimAction (amount: number) {
    writeContract({
      address: ContractAddress,
      abi: ChainWorkBenchABI.abi,
      functionName: 'claim',
      args: [amount, Proof],
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
