
import useSWR from "swr";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { useAtomValue } from "jotai";
import { UuidAtom } from "./state";
import { useFetchUserInfo } from "./use-fetch-user-info";
import { ChainInfos } from "./const";

export interface IClaimToken {
  name: string;
  symbol: string;
  logo: string;
  chainInfo: (typeof ChainInfos)[keyof typeof ChainInfos];
  tokenDecimal: number;
  eventData: Record<string, any>;
}


export function useClaimData(currentToken: IClaimToken, address: string | undefined) {
  const uuid = useAtomValue(UuidAtom);
  const { data: userInfo } = useFetchUserInfo();

  async function fetchClaimData() {
    if (!userInfo || !currentToken) return null;
    const projectName = currentToken.eventData.project_name
    const chainName = currentToken.chainInfo.name

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
        user_id: uuid,
        project_name: projectName,
      }),
    });
    console.log(res);

    return res;
  }

  const res = useSWR(() => JSON.stringify({
    currentToken,
    uuid
  }), fetchClaimData);

  return res;
}
