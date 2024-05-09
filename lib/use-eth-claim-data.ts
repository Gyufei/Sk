import useSWR from "swr";
import fetcher from "./fetcher";
import { ApiHost } from "./path";

export default function useEthClaimData() {
  const res = useSWR(`${ApiHost}/user/info?user_id=`, fetcher);

  return res;
}
