
import useSWR from "swr";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { useAtomValue } from "jotai";
import { UuidAtom } from "./state";
import { useFetchUserInfo } from "./use-fetch-user-info";

export function useClaimData(chainName:string, address: string | undefined) {
  const uuid = useAtomValue(UuidAtom);
  const { data: userInfo } = useFetchUserInfo();

  async function fetchClaimData() {
    if (!userInfo) return null;

    const shouldAddress = userInfo.wallets[chainName]

    if (shouldAddress !== address) return {
      claim_amount: 0
    }

    const res: any = await fetcher(`${ApiHost}/user/claim_markle_proof`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid
      }),
    });
    console.log(res);

    return res;
  }

  const res = useSWR(() => JSON.stringify({
    userInfo,
    uuid
  }), fetchClaimData);

  return res;
}
