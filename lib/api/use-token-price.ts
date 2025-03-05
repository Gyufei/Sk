import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";

export interface ITokenPrice {
  symbol: string;
  price: number;
}

export function useTokenPrice(symbol: string, enable: boolean) {
  const url = enable ? `${ApiHost}/token/price?token_name=${symbol}` : "";

  const res = useSWR<ITokenPrice>(url, fetcher);

  return res;
}
