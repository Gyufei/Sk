import { ApiHost } from "./path";
import fetcher from "./fetcher";
import useSWR from "swr";

const ChainNameMap = {
  Ethereum: "ETH",
  Solana: "SOLANA",
  OP: "OP",
} as const;

export function useRecipients(chain: string, token: string, enable: boolean) {
  const chainName = ChainNameMap[chain as keyof typeof ChainNameMap];
  const url = enable
    ? `${ApiHost}/pay/deposit_address/inquire?chain=${chainName}&token=${token}`
    : "";

  const res = useSWR<{
    deposit_address: string;
  }>(url, fetcher);

  return res;
}
