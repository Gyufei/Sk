import useSWRMutation from "swr/mutation";
import { UuidAtom } from "./state";
import { useAtomValue } from "jotai";
import fetcher from "./fetcher";
import { ApiHost, isProduction } from "./path";

const ChainNameMap = {
  Ethereum: isProduction ? "ETH" : "SEP",
  Solana: isProduction ? "SOL" : "SOLDEV",
  OP: "OP",
} as const;

export interface IOrderInfo {
  product_price: string;
}

export function useCreateOrder() {
  const uuid = useAtomValue(UuidAtom);

  async function buyFetcher(
    _key: string,
    {
      arg,
    }: {
      arg: {
        productId: string;
        extraData: Record<string, string> | null;
        paymentWallet: string;
        chainName: string;
        chainCoin: string;
      };
    },
  ) {
    const { productId, extraData, paymentWallet, chainName, chainCoin } = arg;

    const chain_name = ChainNameMap[chainName as keyof typeof ChainNameMap];

    const notesData = extraData
      ? {
          order_notes: extraData,
        }
      : {};

    const reqData = {
      product_id: productId,
      payment_wallet: paymentWallet,
      chain_name: chain_name,
      chain_coin: chainCoin,
      user_id: uuid,
      ...notesData,
    };

    const result: any = await fetcher(`${ApiHost}/order/v2/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });

    return result;
  }

  const res = useSWRMutation<any>("buyProduct", buyFetcher);

  return res;
}
