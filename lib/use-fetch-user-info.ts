import { useAtom } from "jotai/react";
import { UuidAtom } from "./state";
import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";
import { useRouter } from "next/navigation";

export function useFetchUserInfo() {
  const [uuid, setUuid] = useAtom(UuidAtom);
  const router = useRouter();

  async function getUserInfo() {
    if (!uuid) return;

    const fetchRes: any = await fetcher(`${ApiHost}/user/info?user_id=${uuid}`);

    if (uuid && fetchRes && fetchRes.data === false) {
      setUuid("");
      router.push("/club");
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
