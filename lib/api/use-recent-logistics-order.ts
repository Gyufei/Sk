import { useAtomValue } from "jotai/react";
import { UuidAtom } from "./state";
import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";

export function useRecentLogisticsOrder() {
  const uuid = useAtomValue(UuidAtom);

  async function getLogisticsOrder() {
    if (!uuid) return;

    const fetchRes: any = await fetcher(
      `${ApiHost}/user/recent_logistics_order?user_id=${uuid}`,
    );

    return fetchRes;
  }

  const res = useSWR(`logistics ${uuid}`, getLogisticsOrder);

  return res;
}
