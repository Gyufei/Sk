import { useAtomValue } from "jotai";
import { UuidAtom } from "./api/state";
import useSWR from "swr";
import { ApiHost } from "./api/path";
import fetcher from "./api/fetcher";

export function useCheckOffChainClaimed(
  isOffChain: boolean,
  eventName: string,
  claimVersion: number,
) {
  const uuid = useAtomValue(UuidAtom);

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
