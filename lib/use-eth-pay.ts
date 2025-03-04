import { useWriteContract } from "wagmi";
import { IChain } from "./const";
import { useContractAddress } from "./contract/use-contract-address";
import { ChainWorkBenchABIV2 } from "./contract/eth/ChainWorkBench-v2";
import { IPayToken } from "@/app/[local]/mart/pay-config";
import NP from "number-precision";
import { useRecipients } from "./api/use-recipient";
import { useTokenPrice } from "./api/use-token-price";
import { isProduction } from "./api/path";
import { IOrderInfo } from "./api/use-create-order";

export function useEthPay(chain: IChain, token: IPayToken) {
  const { address: ContractAddress } = useContractAddress(
    chain.name.toLowerCase() as any,
    true,
  );

  const { data: ethPriceData } = useTokenPrice("ETH");
  const { data: recipientData } = useRecipients();

  const {
    writeContract,
    data,
    isPending: isLoading,
    isError,
    isSuccess,
    error,
    reset,
  } = useWriteContract();

  function payAction(orderInfo: IOrderInfo) {
    if (!recipientData) {
      console.error("recipient data is not found");
      return;
    }

    const tokenAddress = token.address as `0x${string}`;

    const payPrice = orderInfo.product_price;
    const nonce = orderInfo.vendor_order_no;
    const recipient = recipientData[chain.name] as `0x${string}`;

    if (token.isStable) {
      const payAmountBig = BigInt(
        Math.floor(NP.times(payPrice, 10 ** token.decimals)),
      );

      writeContract({
        address: tokenAddress,
        abi: [
          {
            constant: false,
            inputs: [
              { name: "_to", type: "address" },
              { name: "_value", type: "uint256" },
            ],
            name: "transfer",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "transfer",
        args: [recipient, payAmountBig],
        nonce,
      });
      return;
    }

    if (!ethPriceData) {
      console.error("eth price data is not found");
      return;
    }

    const ethPrice = isProduction ? ethPriceData?.price : 1000;
    const usdcAmountBig = BigInt(Math.floor(NP.times(payPrice, 10 ** 6)));
    const ethAmount = BigInt(
      Math.floor(NP.times(NP.divide(payPrice, ethPrice), 10 ** 18)),
    );
    console.log(ethAmount);

    writeContract({
      address: ContractAddress as `0x${string}`,
      abi: ChainWorkBenchABIV2,
      functionName: "swapETHForFixedUSDC",
      args: [usdcAmountBig, recipient],
      value: ethAmount,
      nonce,
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
    reset,
  };
}
