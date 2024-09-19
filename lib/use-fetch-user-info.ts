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

    const res: any = await fetcher(`${ApiHost}/user/info?user_id=${uuid}`);

    if (res && res.data !== false) {
      return res;
    }

    if (uuid && res && res.data === false) {
      setUuid("");
      router.push("/club");
      return {};
    }

    return res;
  }

  const res = useSWR(uuid, getUserInfo);

  return {
    ...res,
    getUserInfo: res.mutate,
  };
}
