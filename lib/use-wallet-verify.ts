import { useAtomValue } from "jotai";
import { UuidAtom } from "./state";
import fetcher from "./fetcher";
import { ApiHost } from "./path";

export function useWalletVerify() {
  const uuid = useAtomValue(UuidAtom);

  async function walletVerify({
    chain_name,
    addr,
    signature,
    salt,
  }: {
    chain_name: string;
    addr: string;
    signature: string;
    salt: string;
  }) {
    if (!addr || !signature || !salt) return;
    const res: any = await fetcher(`${ApiHost}/wallet/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chain_name: chain_name,
        wallet_address: addr,
        signature: signature,
        user_id: uuid,
        salt: salt,
      }),
    });

    if (!res.status) {
      throw new Error(
        "sign in error:" +
          `${chain_name} ${addr} ${signature} ${salt} ${JSON.stringify(res)}`,
      );
    }

    return res;
  }

  return {
    walletVerify,
  };
}
