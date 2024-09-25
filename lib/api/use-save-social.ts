import { useAtomValue } from "jotai/react";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { UuidAtom } from "./state";
import { useFetchUserInfo } from "./use-fetch-user-info";

export function useSaveSocial() {
  const uuid = useAtomValue(UuidAtom);
  const { getUserInfo } = useFetchUserInfo();

  async function saveSocial(params: {
    name: string;
    data: string;
    code?: string;
  }) {
    if (!uuid) return;

    const res: any = await fetcher(`${ApiHost}/user/social_media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        social_media_name: params.name,
        social_media_data: params.data,
        ...(params.code
          ? {
              code: params.code,
            }
          : {}),
      }),
    });

    getUserInfo();

    return res;
  }

  return {
    saveSocial,
  };
}
