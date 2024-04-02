import { useAtomValue } from "jotai/react";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { UuidAtom } from "./state";
import { useFetchUserInfo } from "./use-fetch-user-info";

export function useSaveSocial() {
  const uuid = useAtomValue(UuidAtom);
  const { getUserInfo } = useFetchUserInfo();

  async function saveSocial(params: { name: string; data: string }) {
    if (!uuid) return;

    const res: any = fetcher(`${ApiHost}/wallet/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        social_media_name: params.name,
        social_media_data: params.data,
      }),
    });

    getUserInfo();

    return res;
  }

  return {
    saveSocial,
  };
}
