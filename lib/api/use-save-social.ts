import { useAtomValue } from "jotai/react";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { UuidAtom } from "./state";
import { useFetchUserInfo } from "./use-fetch-user-info";
import useSWRMutation from "swr/mutation";

export function useSaveSocial() {
  const uuid = useAtomValue(UuidAtom);
  const { getUserInfo } = useFetchUserInfo();

  async function saveSocial(
    _: string,
    {
      arg,
    }: {
      arg: {
        name: string;
        data: string | Record<string, any>;
      };
    },
  ) {
    if (!uuid) return;

    const res: any = await fetcher(`${ApiHost}/user/social_media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        social_media_name: arg.name,
        social_media_data: arg.data,
      }),
    });

    getUserInfo();

    return res;
  }

  const mutationRes = useSWRMutation<any>("saveSocial", saveSocial);

  return mutationRes;
}
