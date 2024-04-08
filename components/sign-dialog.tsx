import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useChainId, useSignMessage, useSwitchChain } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAtom } from "jotai/react";
import { UuidAtom } from "@/lib/state";
import fetcher from "@/lib/fetcher";
import { ApiHost } from "@/lib/path";

export default function SignDialog({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: (_o: boolean) => void;
}) {
  const [uuid, setUuid] = useAtom(UuidAtom);
  const { address, isConnected, isDisconnected } = useAccount();
  const { open } = useWeb3Modal();
  const { signMessage } = useSignMessage();
  const chainId = useChainId();
  const { switchChain, chains } = useSwitchChain();

  const [signing, setSigning] = useState(false);

  const currentChain = useMemo(() => {
    return chains.find((c) => c.id === chainId);
  }, [chainId, chains]);

  useEffect(() => {
    if (isDisconnected && !address) {
      setUuid("");
      setDialogOpen(true);
    }
  }, [isDisconnected, address, uuid]);

  async function switchChainAndSign() {
    let localUU: string | null = null;
    try {
      localUU = JSON.parse(localStorage.getItem("uuid") || "");
    } catch (e) {
      localStorage.removeItem("uuid");
      console.log(
        "error for get localStorage uuid",
        localStorage.getItem("uuid"),
        e,
      );
    }
    if (address && isConnected && !localUU) {
      if (chainId !== 10) {
        switchChain(
          {
            chainId: 10,
          },
          {
            onSuccess: () => {
              signMsg();
            },
          },
        );
      } else {
        signMsg();
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      switchChainAndSign();
    }, 500);
  }, [address, uuid]);

  async function signMsg() {
    setSigning(true);
    const ts = Math.round(new Date().getTime() / 1000);
    signMessage(
      {
        message: JSON.stringify({
          message: "welcome to juu17 club",
          ts,
        }),
      },
      {
        onSettled: () => {
          setSigning(false);
        },
        onError: (error) => {
          console.log("error", error);
          setSigning(false);
        },
        onSuccess: (data) => {
          postSignData(data, ts);
        },
      },
    );
  }

  async function postSignData(data: string, ts: number) {
    try {
      const res: any = await fetcher(`${ApiHost}/user/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_type: "wallet",
          login_data: {
            wallet_address: address,
            chain_name: currentChain?.name,
            signature: data,
            sign_at: ts,
          },
        }),
      });
      if (res.staus === false || !res.uuid) {
        throw new Error("sign failed");
      }
      const uuid = res.uuid;
      setUuid(uuid);
      setSigning(false);
      setDialogOpen(false);
    } catch (e) {
      setSigning(false);
    }
  }

  function handleSign() {
    if (signing) return;

    if (!address) {
      open();
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
