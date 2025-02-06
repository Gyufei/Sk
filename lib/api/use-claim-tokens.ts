import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";
import { ChainInfos } from "../const";
import { useFetchUserInfo } from "./use-fetch-user-info";

export interface IClaimToken {
  name: string;
  symbol: string;
  logo: string;
  chainInfo:
    | (typeof ChainInfos)[keyof typeof ChainInfos] & { isOffChain: boolean };
  tokenDecimal: number;
  eventData: Record<string, any>;
  isCutOff: boolean;
  timeline: number;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export function useClaimTokens() {
  const { data: userInfo } = useFetchUserInfo();

  async function fetchAllEventsData() {
    const eventsData = await fetcher(
      `${ApiHost}/events?user_id=${userInfo.user_id}`,
    );

    if (!eventsData || !eventsData.length)
      return { claimTokens: [], claimChunkArray: [] };

    const claimTokens = eventsData
      .map((event: Record<string, any>) => {
        if (!event.version) {
          return {
            version: "v1",
            ...event,
          };
        }
        return event;
      })
      .map((event: Record<string, any>) => {
        const chainInfo =
          event.chain_id === 0
            ? {
                isOffChain: true,
              }
            : Object.values(ChainInfos).find((info) => {
                if (
                  (String(event.chain_id) === "901" ||
                    String(event.chain_id) === "902" ||
                    String(event.chain_id) === "903") &&
                  info.name === "Solana"
                ) {
                  return info;
                }

                return String(info.chainId) === String(event.chain_id);
              });

        const isCutOff = event.timeline < Date.now() / 1000;

        return {
          name: event.token_name,
          symbol: event.token_symbol,
          chainInfo: chainInfo || {
            name: "Ethereum",
            logo: "/icons/network/ethereum.svg",
            isEVM: true,
            chainId: 11155111,
          },
          timeline: event.timeline,
          isCutOff,
          logo: event.token_url,
          tokenDecimal: event.token_decimal,
          eventData: event,
        } as IClaimToken;
      });

    return {
      claimTokens,
      claimChunkArray: chunkArray<IClaimToken>(claimTokens, 4),
    };
  }

  const res = useSWR("events", fetchAllEventsData);

  return res;
}
