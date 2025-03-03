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

  const { data: recipientData } = useRecipients();

  const {
    writeContract,
    data,
    isPending: isLoading,
    isError,
    isSuccess,
    error,
  } = useWriteContract();

  function payAction(payInfo: Record<string, any>) {
    if (!recipientData) {
      console.error("recipient data is not found");
      return;
    }

    const tokenAddress = token.address as `0x${string}`;

    const payPrice = payInfo.product_price;
    const recipient = recipientData["eth"].address as `0x${string}`;

    if (token.isStable) {
      const payAmountBig = BigInt(
        Math.floor(NP.times(payPrice, 10 ** token.decimals)),
      );

      writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "transfer",
        args: [recipient, payAmountBig],
      });
      return;
    }

    const ethPrice = recipientData?.ethPrice;
    const usdcAmountBig = BigInt(Math.floor(NP.times(payPrice, 10 ** 6)));
    const ethAmount = BigInt(
      Math.floor(NP.times(NP.divide(payPrice, ethPrice), 10 ** 18)),
    );

    writeContract({
      address: ContractAddress as `0x${string}`,
      abi: ChainWorkBenchABIV2,
      functionName: "swapETHForFixedUSDC",
      args: [usdcAmountBig, recipient],
      value: ethAmount,
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
