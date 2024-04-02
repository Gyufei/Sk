import { useAtomValue, useSetAtom } from "jotai/react";
import { UserInfoAtom, UuidAtom } from "./state";
import { useEffect } from "react";
import fetcher from "./fetcher";
import { ApiHost } from "./path";

export function useFetchUserInfo() {
  const uuid = useAtomValue(UuidAtom);
  const setUserInfo = useSetAtom(UserInfoAtom);

  async function getUserInfo() {
    if (uuid) {
      const info = fetcher(`${ApiHost}/user/info?user_id=${uuid}`);
      setUserInfo(info);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, [uuid]);

  return {
    getUserInfo,
  };
}
