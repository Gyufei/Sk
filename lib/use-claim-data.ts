
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
    const isEVM = currentToken.chainInfo.isEVM

    const shouldClaim = (isEVM ? userInfo.wallets['main_wallet']  === address : false) || userInfo.wallets['alt_wallets'].some((w: any) => w.network === chainName && w.address === address)
    if (!shouldClaim) return {
      claim_amount: 0
    }

    const res: any = await fetcher(`${ApiHost}/user/claim_markle_proof`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet_address: address,
        user_id: uuid,
        project_name: projectName,
      }),
    });
    console.log('markle_proof', res);

    return res;
  }

  const res = useSWR(() => JSON.stringify({
    currentToken: currentToken || '',
    uuid
  }), fetchClaimData);

  return res;
}
