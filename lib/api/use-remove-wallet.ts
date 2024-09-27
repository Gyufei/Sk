import { useAtomValue } from "jotai";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { UuidAtom } from "./state";
import useSWRMutation from "swr/mutation";

export function useRemoveWallet() {
  const uuid = useAtomValue(UuidAtom);

  async function removeWalletAction(
    _: string,
    {
      arg: { chainName, serialNumber },
    }: {
      arg: {
        chainName: string;
        serialNumber: number;
      };
    },
  ) {
    const res: any = await fetcher(`${ApiHost}/wallet/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        chain_name: chainName,
        serial_number: serialNumber,
      }),
    });

    return res;
  }

  const removeRes = useSWRMutation("remove-wallet", removeWalletAction);

  return removeRes;
}
