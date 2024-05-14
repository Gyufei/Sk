import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useDisconnect,
  useSignMessage,
  useSwitchNetwork,
} from "wagmi";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { useAtom } from "jotai/react";
import { UuidAtom } from "@/lib/state";
import fetcher from "@/lib/fetcher";
import { ApiHost } from "@/lib/path";
import { genSignMsg } from "@/lib/sign-utils";
import { ChainInfos } from "@/lib/const";

export default function SignDialog({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: (_o: boolean) => void;
}) {
  const [uuid, setUuid] = useAtom(UuidAtom);
  const { address, isConnected, isDisconnected } = useAccount();
  const { open: wcModalOpen } = useWeb3Modal();
  const { open: isWcModalOpen } = useWeb3ModalState();
  const { signMessageAsync: signMessage } = useSignMessage();
  const chainId = useChainId();
  const { switchNetworkAsync: switchChain } = useSwitchNetwork();
  const { disconnect } = useDisconnect();

  const [signing, setSigning] = useState(false);

  useEffect(() => {
    console.log(`UE1 isDisconnected:${isDisconnected} address:${address}`);
    if (isDisconnected && !address) {
      setUuid("");
      setDialogOpen(true);
    } else {
      switchChainAndSign();
    }
  }, [isDisconnected, address]);

  async function switchChainAndSign() {
    console.log(
      `switchChainAndSign address:${address} isConnected:${isConnected} uuid:${uuid}`,
    );

    if (address && isConnected && !uuid) {
      if (chainId !== 10) {
        switchChain!(10)
          .then(() => {
            signMsg();
          })
          .catch((e) => {
            console.log("Change chain error", e);
          });
      } else {
        console.log("signMsg");
        await signMsg();
      }
    }
  }

  async function signMsg() {
    setSigning(true);
    const { salt, msg } = genSignMsg();

    try {
      const signature = await signMessage({
        message: msg,
      });

      setTimeout(() => {
        if (!signature) {
          throw new Error("sign error");
        }
      }, 5000);

      postSignData(signature, salt);
    } catch (e) {
      console.error("error", e);
      setSigning(false);
      disconnect();
    }
  }

  async function postSignData(signature: string, salt: string) {
    try {
      console.log(chainId, "chainId");
      const currentChainInfo = Object.values(ChainInfos).find(
        (c) => c.chainId === chainId,
      );
      const res: any = await fetcher(`${ApiHost}/user/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_type: "wallet",
          login_data: {
            wallet_address: address,
            chain_name: currentChainInfo?.name,
            signature,
            salt,
          },
        }),
      });

      if (res.staus === false || !res.uuid) {
        throw new Error(
          "sign in error:" +
            `${
              currentChainInfo?.name
            } ${address} ${signature} ${salt} ${JSON.stringify(res)}`,
        );
      }

      setUuid(res.uuid);
      // console.log(`setUuid: ${res.uuid}`);
      setSigning(false);
      setDialogOpen(false);
    } catch (e) {
      setSigning(false);
      console.log(e);
    }
  }

  function handleSign() {
    if (signing) return;

    if (!address) {
      wcModalOpen();
    } else {
      switchChainAndSign();
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        if (signing && !isOpen) {
          setDialogOpen(true);
        }
      }}
    >
      <DialogContent
        showOverlay={false}
        showClose={false}
        className="flex w-[400px] flex-col items-center gap-0 rounded-3xl border-none bg-[rgba(255,255,255,0.1)] p-[35px] backdrop-blur-[7px]"
        style={{
          visibility: isWcModalOpen ? "hidden" : "visible",
        }}
      >
        <div className="text-xl leading-[30px]">Welcome to Juu17 Club</div>
        {signing ? (
          <div className="mt-[50px] flex h-12 items-center justify-center rounded-lg px-[100px] text-base leading-6">
            Signing...
          </div>
        ) : (
          <div
            onClick={handleSign}
            className="normal-line-button mt-[50px] flex h-12 cursor-pointer items-center justify-center rounded-lg border px-[100px] text-base leading-6"
          >
            Sign In
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
