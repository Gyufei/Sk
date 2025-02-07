import useSWR from "swr";
import fetcher from "./api/fetcher";
import { ApiHost } from "./api/path";
import { useAtomValue } from "jotai";
import { UuidAtom } from "./api/state";
import { useFetchUserInfo } from "./api/use-fetch-user-info";
import { IClaimToken } from "./api/use-claim-tokens";
import { useMemo } from "react";

export interface IClaimData {
  claim_amount: number;
  proofs: string[];
  recipients: string[];
  version: string;
  uid: string;
}

export function useClaimData(
  currentToken: IClaimToken | undefined,
  address: string | undefined,
) {
  const uuid = useAtomValue(UuidAtom);
  const { data: userInfo } = useFetchUserInfo();

  const canClaim = useMemo(() => {
    if (!address) return false;

    const isEVM = (currentToken?.chainInfo as any).isEVM;
    const isOffChain = (currentToken?.chainInfo as any).isOffChain;
    const isSolana = (currentToken?.chainInfo as any).name === "Solana";

    if (isSolana && currentToken?.eventData?.version === "v1") {
      return false;
    }

    if (isEVM || isOffChain) {
      return (
        userInfo?.wallets?.EVM?.length &&
        (userInfo?.wallets?.EVM || []).includes(address)
      );
    } else if (isSolana) {
      return (
        userInfo?.wallets?.Solana?.length &&
        (userInfo?.wallets?.Solana || []).includes(address)
      );
    }

    return false;
  }, [userInfo, address, currentToken]);

  async function fetchClaimData() {
    if (!userInfo || !currentToken) return null;

    if (!canClaim) {
      return {
        claim_amount: 0,
      };
    }

    const isOffChain = (currentToken.chainInfo as any).isOffChain;
    if (isOffChain) {
      return {
        claim_amount: 1,
      };
    }

    const projectName = currentToken.eventData.project_name;

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

    return res as IClaimData;
  }

  const res = useSWR(
    () =>
      JSON.stringify({
        currentToken: currentToken || "",
        canClaim,
        uuid,
        address: address || "",
      }),
    fetchClaimData,
  );

  return res;
}
