import { useAtomValue } from "jotai";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { UuidAtom } from "./state";

export function useRemoveWallet() {
  const uuid = useAtomValue(UuidAtom);

  async function removeWalletAction(chainName: string, serialNumber: number) {
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

  return {
    removeWalletAction,
  };
}
