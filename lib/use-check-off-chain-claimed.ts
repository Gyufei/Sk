import { useAtomValue } from "jotai";
import { UuidAtom } from "./api/state";
import useSWR from "swr";
import { ApiHost } from "./api/path";
import fetcher from "./api/fetcher";
import { IClaimToken } from "./api/use-claim-tokens";

export function useCheckOffChainClaimed(currentToken: IClaimToken | undefined) {
  const uuid = useAtomValue(UuidAtom);
  const isOffChain = !!(currentToken?.chainInfo as any)?.isOffChain;
  const eventsData = currentToken?.eventData;
  const claimVersion = eventsData?.claim_version;
  const eventName = eventsData?.event_name;

  const res = useSWR(
    isOffChain && uuid && eventName && claimVersion
      ? `${ApiHost}/events/claim_status?user_id=${uuid}&event_name=${eventName}&claim_version=${claimVersion}`
      : null,
    fetcher,
  );

  return {
    ...res,
    data: {
      claimed: res?.data?.status,
      ...res.data,
    },
  };
}
