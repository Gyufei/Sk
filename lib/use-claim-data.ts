
import useSWR from "swr";
import fetcher from "./fetcher";
import { ApiHost } from "./path";

export function useClaimData(address: string | undefined) {
  async function fetchClaimData() {
    console.log(address);
    if (!address) return;

    const res: any = await fetcher(`${ApiHost}/user/claim_markle_proof`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet_address: address,
      }),
    });

    console.log(res);
    return res;
  }

  const res = useSWR(address, fetchClaimData);

  return res;
}
