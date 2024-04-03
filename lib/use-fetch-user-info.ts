import { useAtomValue, useSetAtom } from "jotai/react";
import { UserInfoAtom, UuidAtom } from "./state";
import { useEffect } from "react";
import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";

export function useFetchUserInfo() {
  const uuid = useAtomValue(UuidAtom);
  const setUserInfo = useSetAtom(UserInfoAtom);

  const res = useSWR(`${ApiHost}/user/info?user_id=${uuid}`, fetcher);

  useEffect(() => {
    if (res.data) {
      setUserInfo(res.data);
    }
  }, [res.data, setUserInfo]);

  return {
    ...res,
    getUserInfo: res.mutate,
  };
}
