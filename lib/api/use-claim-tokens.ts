import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";
import { useMemo } from "react";
import { ChainInfos } from "../const";

export interface IClaimToken {
  name: string;
  symbol: string;
  logo: string;
  chainInfo: (typeof ChainInfos)[keyof typeof ChainInfos];
  tokenDecimal: number;
  eventData: Record<string, any>;
  isCutOff: boolean;
  timeline: number;
}

export function useClaimTokens() {
  async function fetchAllEventsData() {
    const res: Array<{
      project_name: string;
      claim_version: number;
    }> = await fetcher(`${ApiHost}/static/events.json`);

    const eventData = await Promise.all(
      res.map(async (item) => {
        const eD = await fetcher(
          `${ApiHost}/events?project_name=${item.project_name}`,
        );
        return {
          ...item,
          ...eD,
        };
      }),
    );

    return eventData;
  }

  const res = useSWR("events", fetchAllEventsData);

  const eventsData = useMemo(() => {
    if (!res.data) return null;
    return res.data;
  }, [res.data]);

  const claimTokens = useMemo(() => {
    if (!eventsData || !eventsData.length) return [];

    const ts = eventsData.map((event: Record<string, any>) => {
      const chainInfo =
        event.chain_id === 0
          ? {
              isOffChain: true,
            }
          : Object.values(ChainInfos).find((info) => {
              if (
                (String(event.chain_id) === "901" ||
                  String(event.chain_id) === "902") &&
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

    return ts;
  }, [eventsData]);

  return {
    ...res,
    data: claimTokens,
  };
}
