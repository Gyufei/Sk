import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import fetcher from "@/lib/fetcher";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/state";
import { ApiHost } from "@/lib/path";
import { useFetchUserInfo } from "@/lib/use-fetch-user-info";
import { useAccount, useChainId, useSignMessage, useSwitchChain } from "wagmi";
import { ChainInfos } from "@/lib/const";
import { useWalletVerify } from "@/lib/use-wallet-verify";

export function WalletItem({
  name,
  address,
  setName,
  setAddress,
  isSign,
  setIsSign,
  isLastEvm = false,
  walletOptions,
  handleRemove,
}: {
  name: string;
  address: string;
  isSign: boolean;
  setName: (_n: string) => void;
  setAddress: (_a: string) => void;
  setIsSign: (_i: boolean) => void;
  isLastEvm?: boolean;
  walletOptions: any[];
  handleRemove: () => void;
}) {
  const { signMessage } = useSignMessage();
  const { address: walletAddress } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const uuid = useAtomValue(UuidAtom);
  const [popOpen, setPopOpen] = useState(false);
  const { getUserInfo } = useFetchUserInfo();
  const { walletVerify } = useWalletVerify();

  const disabled = useMemo(() => {
    if (isSign) {
      return false;
    }
    return !name;
  }, [name, isSign]);

  async function handleOperation() {
    if (disabled) return;
    if (!isSign) {
      await linkWallet();
    } else {
      await removeWallet();
    }
    getUserInfo();
  }

  async function linkWallet() {
    const chainInfo = ChainInfos[name];
    if (chainInfo?.isEVM) {
      await signEvm();
    } else {
      return;
    }
  }

  async function signEvm() {
    const chainInfo = ChainInfos[name];
    console.log(chainInfo);
    if (String(chainId) !== String(chainInfo.chainId)) {
      console.log("switch chain");
      switchChain(
        {
          chainId: chainInfo.chainId!,
        },
        {
          onError: (error: any) => {
            console.error("switch chain error", error);
          },
          onSuccess: () => {
            signMsg();
          },
        },
      );
    } else {
      signMsg();
    }
  }

  async function signMsg() {
    const ts = Math.round(new Date().getTime() / 1000);
    signMessage(
      {
        message: JSON.stringify({
          message: "welcome to juu17 club",
          ts,
        }),
      },
      {
        onSettled: () => {},
        onError: (error: any) => {
          console.log("error", error);
        },
        onSuccess: async (data) => {
          const res = await walletVerify({
            chain_name: name,
            addr: walletAddress!,
            signature: data,
            ts: ts,
          });

          if (res.status) {
            setAddress(walletAddress!);
            setIsSign(true);
          }
        },
      },
    );
  }

  async function removeWallet() {
    const res: any = await fetcher(`${ApiHost}/wallet/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        chain_name: name,
      }),
    });

    console.log(res);
    handleRemove();
  }

  return (
    <div className="mt-6 flex items-center">
      <Popover open={popOpen} onOpenChange={(isOpen) => setPopOpen(isOpen)}>
        <PopoverTrigger
          asChild
          data-disabled={isLastEvm}
          className="data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed"
        >
          <div
            onClick={() => setPopOpen(!popOpen)}
            className="flex h-12 w-[200px] items-center justify-between border-b border-solid border-[#515151]"
          >
            <div className="flex items-center">
              {ChainInfos[name] ? (
                <Image
                  src={ChainInfos[name].logo}
                  width={30}
                  height={30}
                  alt="wallet"
                />
              ) : (
                <div className="h-[30px] w-[30px] rounded-full bg-slate-400"></div>
              )}
              <div className="ml-3 text-base leading-6 text-[#d6d6d6]">
                {name}
              </div>
            </div>
            <Image
              data-open={popOpen}
              src="./icons/arrow-down.svg"
              width={24}
              height={24}
              alt="down"
              className="data-[open=true]:rotate-180"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="no-scroll-bar flex h-[300px] w-[200px] flex-col items-stretch space-y-2 overflow-y-auto border-none bg-[#262626] p-4">
          {walletOptions.map((c) => (
            <div
              key={c}
              className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
              onClick={() => {
                setName(c);
                setPopOpen(false);
              }}
            >
              <Image
                src={ChainInfos[c].logo}
                width={30}
                height={30}
                alt="wallet"
              />
              <div className="ml-3 text-base leading-6 text-[#d6d6d6]">{c}</div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
      <div className="relative ml-4 flex h-12 flex-1 items-center border-b border-[rgba(255,255,255,0.2)] ">
        <div className="text-base leading-6 text-[#d6d6d6]">{address}</div>
        {isSign && (
          <Image
            src="./icons/sign.svg"
            width={20}
            height={20}
            alt="sign"
            className="absolute right-0 top-[14px] cursor-pointer"
          />
        )}
      </div>
      {!isLastEvm && (
        <div
          onClick={handleOperation}
          data-disabled={disabled}
          className="ml-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed  data-[disabled=true]:opacity-50"
        >
          {isSign ? (
            <Image src="./icons/unlink.svg" width={24} height={24} alt="save" />
          ) : (
            <Image src="./icons/link.svg" width={24} height={24} alt="save" />
          )}
        </div>
      )}
    </div>
  );
}
