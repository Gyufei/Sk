import { useAtom } from "jotai/react";
import { UuidAtom } from "./state";
import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";

export function useFetchUserInfo() {
  const [uuid, setUuid] = useAtom(UuidAtom);

  async function getUserInfo() {
    if (!uuid) return;

    const fetchRes: any = await fetcher(`${ApiHost}/user/info?user_id=${uuid}`);

    if (uuid && fetchRes && fetchRes.data === false) {
      setUuid("");
      return {};
    }

    return fetchRes;
  }

  const res = useSWR(uuid, getUserInfo);

  return {
    ...res,
    getUserInfo: res.mutate,
  };
}
