import { useAtomValue } from "jotai/react";
import { UuidAtom } from "./state";
import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";

export function useRecentTickets() {
  const uuid = useAtomValue(UuidAtom);

  async function getRecentTickets() {
    if (!uuid) return;

    const fetchRes: any = await fetcher(
      `${ApiHost}/ticket/recent?user_id=${uuid}`,
    );

    return fetchRes;
  }

  const res = useSWR(`tickets ${uuid}`, getRecentTickets);

  return res;
}
