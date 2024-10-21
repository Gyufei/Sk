import useSWR from "swr";
import { ApiHost } from "./path";
import fetcher from "./fetcher";

export function useClubShippingProducts() {
  const { data } = useSWR(
    `${ApiHost}/static/products.json`,
    fetcher
  );

  return {
    products: data
  };
}