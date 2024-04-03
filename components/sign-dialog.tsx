import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useMemo } from "react";
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

  const currentChain = useMemo(() => {
    return chains.find((c) => c.id === chainId);
  }, [chainId, chains]);

  useEffect(() => {
    if (isDisconnected && !address) {
      setDialogOpen(true);
      setUuid("");
    }
  }, [isDisconnected, address]);

  useEffect(() => {
    if (address && isConnected && !uuid) {
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
  }, [address, uuid, chainId, isConnected]);

  async function signMsg() {
    signMessage(
      {
        message: "welcome to juu17 club",
      },
      {
        onError: (error) => {
          console.log("error", error);
        },
        onSuccess: (data) => {
          postSignData(data);
        },
      },
    );
  }

  async function postSignData(data: string) {
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
        },
      }),
    });
    const uuid = res.uuid;
    setUuid(uuid);
  }

  function handleSign() {
    setDialogOpen(false);
    open();
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={(isOpen) => setDialogOpen(isOpen)}>
      <DialogContent
        showOverlay={false}
        className="flex w-[400px] flex-col items-center gap-0 rounded-3xl border-none bg-[#rgba(255,255,255,0.1)] p-[35px] backdrop-blur-[300px]"
      >
        <div className="text-xl leading-[30px]">Welcome to Juu17 Club</div>
        <div
          onClick={handleSign}
          className="mt-[50px] flex h-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] px-[100px] text-base leading-6 text-[rgba(255,255,255,0.6)]"
        >
          Sign In
        </div>
      </DialogContent>
    </Dialog>
  );
}
