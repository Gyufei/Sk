import { useAtom, useSetAtom } from "jotai/react";
import { UserInfoAtom, UuidAtom } from "./state";
import { useEffect } from "react";
import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";

export function useFetchUserInfo() {
  const [uuid, setUuid] = useAtom(UuidAtom);
  const setUserInfo = useSetAtom(UserInfoAtom);

  const res = useSWR(uuid ? `${ApiHost}/user/info?user_id=${uuid}` : null, fetcher);

  useEffect(() => {
    if (res.data) {
      setUserInfo(res.data);
    } else {
      console.log('no data', res.data);
      setUserInfo({});
      setUuid("");
    }
  }, [res.data, setUserInfo, setUuid]);

  return {
    ...res,
    getUserInfo: res.mutate,
  };
}
