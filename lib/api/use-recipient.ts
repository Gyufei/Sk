import { ApiHost, isProduction } from "./path";
import fetcher from "./fetcher";
import useSWR from "swr";
import { ChainInfos } from "../const";

export interface IRecipientRes {
  solana_mainnet: "";
  eth_mainnet: "";
  eth_op: "";
  solana_devnet: "";
  eth_sepolia: "";
}

export function useRecipients() {
  async function fetchOrigin() {
    const url = `${ApiHost}/static/receive_accounts.json?t=${new Date().getTime()}`;
    const res: IRecipientRes = await fetcher(url);

    const ethAddress = isProduction ? res.eth_mainnet : res.eth_sepolia;
    const solanaAddress = isProduction ? res.solana_mainnet : res.solana_devnet;
    const opAddress = isProduction ? res.eth_op : res.eth_sepolia;

    return {
      [ChainInfos.Ethereum.name]: ethAddress,
      [ChainInfos.Solana.name]: solanaAddress,
      [ChainInfos.OP.name]: opAddress,
    };
  }

  const res = useSWR("recipients", fetchOrigin);

  return res;
}
