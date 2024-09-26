import useSWRMutation from "swr/mutation";
import { UuidAtom } from "./api/state";
import { useAtomValue } from "jotai";
import { useSignMessage } from "wagmi";
import { genOffChainClaimMsg } from "./utils/sign-utils";
import fetcher from "./api/fetcher";
import { ApiHost } from "./api/path";

export function useOffChainClaim() {
  const uuid = useAtomValue(UuidAtom);

  const { signMessageAsync: signMessage } = useSignMessage();

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
    const res = await signEvmMsgAction(wallet, eventName, claimVersion);
    return res;
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
