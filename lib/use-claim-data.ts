import useSWR from "swr";
import fetcher from "./api/fetcher";
import { ApiHost } from "./api/path";
import { useAtomValue } from "jotai";
import { UuidAtom } from "./api/state";
import { useFetchUserInfo } from "./api/use-fetch-user-info";
import { IClaimToken } from "./api/use-claim-tokens";

export function useClaimData(
  currentToken: IClaimToken,
  address: string | undefined,
) {
  const uuid = useAtomValue(UuidAtom);
  const { data: userInfo } = useFetchUserInfo();

  async function fetchClaimData() {
    if (!userInfo || !currentToken) return null;

    const isOffChain = (currentToken.chainInfo as any).isOffChain;
    if (isOffChain) {
      return {
        claim_amount: 1,
        status: true,
      };
    }

    const projectName = currentToken.eventData.project_name;
    const isEVM = currentToken.chainInfo.isEVM;
    const walletChainName = isEVM ? "EVM" : "Solana";

    // should bind wallet of chain then claim
    const shouldClaim = userInfo.wallets[walletChainName].some(
      (w: any) => w === address,
    );

    if (!shouldClaim)
      return {
        claim_amount: 0,
      };

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

    console.log("markle_proof", res);

    return res;
  }

  const res = useSWR(
    () =>
      JSON.stringify({
        currentToken: currentToken || "",
        uuid,
      }),
    fetchClaimData,
  );

  return res;
}
