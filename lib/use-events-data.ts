import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";

export function useEventsData() {
  const res = useSWR(`${ApiHost}/events`, fetcher);

  return res;
}
