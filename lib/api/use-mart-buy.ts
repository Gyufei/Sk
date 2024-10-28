import useSWRMutation from "swr/mutation";
import { UuidAtom } from "./state";
import { useAtomValue } from "jotai";
import fetcher from "./fetcher";
import { ApiHost } from "./path";

export function useMartBuy() {
  const uuid = useAtomValue(UuidAtom);

  async function buyFetcher(
    _key: string,
    {
      arg,
    }: {
      arg: {
        productId: string;
      };
    },
  ) {
    const { productId } = arg;
    const result: any = await fetcher(`${ApiHost}/order/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        user_id: uuid,
      }),
    });

    return result;
  }

  const res = useSWRMutation<any>("buyProduct", buyFetcher);

  return res;
}
