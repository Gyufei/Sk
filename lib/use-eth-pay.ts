import { useWriteContract } from "wagmi";
import { IChain } from "./const";
import { useContractAddress } from "./contract/use-contract-address";
import { ChainWorkBenchABIV2 } from "./contract/eth/ChainWorkBench-v2";
import { IPayToken } from "@/app/[local]/mart/pay-config";

export function useEthPay(chain: IChain, token: IPayToken) {
  const { address: ContractAddress } = useContractAddress(
    chain.name.toLowerCase() as any,
    true,
  );

  const {
    writeContract,
    data,
    isPending: isLoading,
    isError,
    isSuccess,
    error,
  } = useWriteContract();

  function payAction(payInfo: Record<string, any>) {
    writeContract({
      address: ContractAddress as `0x${string}`,
      abi: ChainWorkBenchABIV2,
      functionName: "pay",
      args: [token, payInfo],
    });
  }

  if (error) {
    console.log(error);
  }

  return {
    data,
    payAction,
    isPending: isLoading,
    isError,
    isSuccess,
  };
}
