import useSWRMutation from "swr/mutation";
import { UuidAtom } from "./state";
import { useAtomValue } from "jotai";
import { useChainId, useSignMessage, useSwitchNetwork } from "wagmi";
import { genOffChainClaimMsg } from "./sign-utils";
import fetcher from "./fetcher";
import { ApiHost } from "./path";

export function useOffChainClaim() {
  const uuid = useAtomValue(UuidAtom);

  const chainId = useChainId();
  const { signMessageAsync: signMessage } = useSignMessage();
  const { switchNetworkAsync: switchChain } = useSwitchNetwork();

  async function claimActionFetcher(
    _key: string,
    {
      arg,
    }: {
      arg: {
        wallet: string;
        eventName: string;
        claimVersion: number;
      };
    },
  ) {
    const { wallet, eventName, claimVersion } = arg;
    if (String(chainId) !== String(10)) {
      await switchChain!(10);
      const res = await signEvmMsgAction(wallet, eventName, claimVersion);
      return res;
    } else {
      const res = await signEvmMsgAction(wallet, eventName, claimVersion);
      return res;
    }
  }

  async function signEvmMsgAction(
    wallet: string,
    eventName: string,
    claimVersion: number,
  ) {
    const { salt, msg } = genOffChainClaimMsg(eventName, claimVersion);

    const signature = await signMessage({
      message: msg,
    });

    const res: any = await fetcher(`${ApiHost}/events/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        wallet_address: wallet,
        signature,
        event_name: eventName,
        claim_version: claimVersion,
        salt,
      }),
    });

    return res;
  }

  const {
    data,
    isMutating,
    trigger: claimAction,
    error,
  } = useSWRMutation<any>("ClaimOffChain", claimActionFetcher);

  const isSuccess = !!data;
  const isError = !!error;

  return {
    data,
    claimAction,
    isPending: isMutating,
    isError,
    isSuccess,
  };
}
