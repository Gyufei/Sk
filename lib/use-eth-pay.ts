import { useWriteContract } from "wagmi";
import { IChain } from "./const";
import { useContractAddress } from "./contract/use-contract-address";
import { ChainWorkBenchABIV2 } from "./contract/eth/ChainWorkBench-v2";
import { IPayToken } from "@/app/[local]/mart/pay-config";
import { erc20Abi } from "viem";
import NP from "number-precision";
import { useRecipients } from "./api/use-recipient";

export function useEthPay(chain: IChain, token: IPayToken) {
  const { address: ContractAddress } = useContractAddress(
    chain.name.toLowerCase() as any,
    true,
  );

  const { data: recipients } = useRecipients();

  const {
    writeContract,
    data,
    isPending: isLoading,
    isError,
    isSuccess,
    error,
  } = useWriteContract();

  function payAction(payInfo: Record<string, any>) {
    if (!recipients) {
      return;
    }

    const payAmount = payInfo.product_price;
    const payAmountBig = BigInt(
      Math.floor(NP.times(payAmount, 10 ** token.decimals)),
    );
    const recipient = recipients["eth"].address as `0x${string}`;

    // pay for usdc and usdt
    if (token.isStable) {
      writeContract({
        address: token.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "transfer",
        args: [recipient, payAmountBig],
      });
      return;
    }

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
