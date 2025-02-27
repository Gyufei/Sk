import { useAtomValue } from "jotai/react";
import { UuidAtom } from "./state";
// import { ApiHost } from "./path";
// import fetcher from "./fetcher";
import useSWR from "swr";

export function useRecipients() {
  const uuid = useAtomValue(UuidAtom);

  async function getRecipient() {
    if (!uuid) return;

    // const fetchRes: any = await fetcher(`${ApiHost}/user/info?user_id=${uuid}`);
    const fetchRes = {
      solana: {
        address: "61djCzB4Vq37RFt3vDUr7cu7hZpmtdPBvYwsV9VLaiNi",
      },
      eth: {
        address: "0xf60132e5Cb6A7319dF1524dc8aC6176987a5fE34",
      },
      op: {
        address: "0xf60132e5Cb6A7319dF1524dc8aC6176987a5fE34",
      },
    };

    return fetchRes;
  }

  const res = useSWR("recipient", getRecipient);

  return res;
}
