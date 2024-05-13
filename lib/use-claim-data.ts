
import useSWR from "swr";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { useAtom } from "jotai";
import { UuidAtom } from "./state";
import { useRouter } from "next/navigation";

export function useClaimData() {
  const [uuid, setUuid] = useAtom(UuidAtom);
  const router = useRouter();

  async function fetchClaimData() {
    if (!uuid) return;

    if (!uuid) {
      setUuid("");
      router.push('/club');
    }

    console.log('fetchClaimData', uuid);
    const res: any = await fetcher(`${ApiHost}/user/claim_markle_proof`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid
      }),
    });
    console.log(res);

    return res;
  }

  const res = useSWR(uuid, fetchClaimData);

  return res;
}
