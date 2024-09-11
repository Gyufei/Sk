import { useAtomValue } from "jotai";
import { UuidAtom } from "./state";
import useSWR from "swr";
import { ApiHost } from "./path";
import fetcher from "./fetcher";

export function useCheckOffChainClaimed(
  isOffChain: boolean,
  eventName: string,
  claimVersion: number,
) {
  const uuid = useAtomValue(UuidAtom);

  console.log(isOffChain, uuid, eventName, claimVersion);

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
