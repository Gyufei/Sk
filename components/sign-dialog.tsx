import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAccount, useChainId, useSignMessage, useSwitchChain } from "wagmi";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { useAtom, useAtomValue } from "jotai/react";
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
  const { signMessage } = useSignMessage();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (isDisconnected && !address) {
      setUuid("");
      setDialogOpen(true);
    }
  }, [isDisconnected, address, uuid]);

  useEffect(() => {
    console.log(`uuid:${uuid}`);

    setTimeout(() => {
      console.log("useEffect2");
      switchChainAndSign();
    }, 500);
  }, [address, uuid]);

  const UUID = useAtomValue(UuidAtom);

  async function switchChainAndSign() {
    console.log(`UUID: ${UUID}`);

    // let localUU: string | null = null;
    // localUU = localStorage.getItem("uuid");
    // if (!localUU) {
    //   console.error("Get uuid from localStorage failed");
    //   localStorage.removeItem("uuid");
    //   setUuid("");
    // }
    //
    if (address && isConnected && !UUID) {
      // console.log("3Ag");
      if (chainId !== 10) {
        // console.log("chain10");
        switchChain(
          {
            chainId: 10,
          },
          {
            onError: (e) => {
              console.log("Change chain error", e);
            },
            onSuccess: () => {
              signMsg();
            },
          },
        );
      } else {
        console.log("signMsg");
        signMsg();
      }
    }
  }

  async function signMsg() {
    setSigning(true);
    const { salt, msg } = genSignMsg();

    signMessage(
      {
        message: msg,
      },
      {
        onSettled: () => {
          setSigning(false);
        },
        onError: (error) => {
          console.error("error", error);
          setSigning(false);
        },
        onSuccess: (signature) => {
          postSignData(signature, salt);
        },
      },
    );
  }

  async function postSignData(signature: string, salt: string) {
    try {
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

      // const add = await recoverMessageAddress({
      //   message: JSON.stringify({
      //     message: "welcome to juu17 club",
      //     salt,
      //   }),
      //   signature: signature as any,
      // });
      // console.log(add, address);

      if (res.staus === false || !res.uuid) {
        throw new Error(
          "sign in error:" +
            `${
              currentChainInfo?.name
            } ${address} ${signature} ${salt} ${JSON.stringify(res)}`,
        );
      }
      const uuid = res.uuid;
      setUuid(uuid);
      console.log(`setUuid`);
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
        <div
          onClick={handleSign}
          className="mt-[50px] flex h-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] px-[100px] text-base leading-6 text-[rgba(255,255,255,0.6)]"
        >
          {signing ? "Signing..." : "Sign In"}
        </div>
      </DialogContent>
    </Dialog>
  );
}
