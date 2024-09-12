import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
import {
  useAccount,
  useChainId,
  useSignMessage,
  useSwitchNetwork,
} from "wagmi";
import { ChainInfos } from "@/lib/const";
import { useWalletVerify } from "@/lib/use-wallet-verify";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import base58 from "bs58";
import { genSignMsg } from "@/lib/sign-utils";
import { cn } from "@/lib/utils";

export function WalletItem({
  name,
  address,
  serialNumber,
  setName,
  setAddress,
  isSign,
  setIsSign,
  walletOptions,
  handleRemove,
}: {
  name: string;
  address: string;
  isSign: boolean;
  serialNumber: number;
  setName: (_n: string) => void;
  setAddress: (_a: string) => void;
  setIsSign: (_i: boolean) => void;
  walletOptions: any[];
  handleRemove: () => void;
}) {
  const { signMessageAsync: signMessage } = useSignMessage();
  const { address: walletAddress } = useAccount();
  const chainId = useChainId();
  const { switchNetworkAsync: switchChain } = useSwitchNetwork();

  const uuid = useAtomValue(UuidAtom);
  const [popOpen, setPopOpen] = useState(false);
  const { getUserInfo } = useFetchUserInfo();
  const { walletVerify } = useWalletVerify();

  const isMain = serialNumber === 1;

  const [isOperating, setIsOperating] = useState(false);

  //solana
  const { publicKey, signMessage: solanaSign } = useWallet();
  const solanaAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );
  const { setVisible: setSolanaModalVisible } = useWalletModal();
  const [solHasShow, setSolHasShow] = useState(false);
  useEffect(() => {
    if (name !== "Solana") return;
    if (solHasShow) return;

    if (solanaAddress && !isSign) {
      signSolanaMsg();
      setSolHasShow(true);
    }
  }, [name, isSign, solanaAddress, signSolanaMsg, solHasShow]);

  const opBtnDisabled = useMemo(() => {
    if (isOperating) {
      return true;
    }

    if (isSign) {
      return false;
    }
    return !name;
  }, [name, isSign]);

  async function handleOperation() {
    if (opBtnDisabled) return;
    setIsOperating(true);
    if (!isSign) {
      await linkWallet();
    } else {
      await removeWallet();
    }
    getUserInfo();
    setIsOperating(false);
  }

  async function linkWallet() {
    const chainInfo = ChainInfos[name];
    if (chainInfo?.isEVM) {
      await signEvmMsg();
    }

    if (name === "Solana") {
      signSolanaMsg();
    }
  }

  async function signEvmMsg() {
    const chainInfo = ChainInfos[name];
    if (String(chainId) !== String(chainInfo.chainId)) {
      console.log("switch chain");
      switchChain!(chainInfo.chainId!)
        .then(() => {
          signEvmMsgAction();
        })
        .catch((e) => {
          console.error("switch chain error", e);
        });
    } else {
      signEvmMsgAction();
    }
  }

  async function signEvmMsgAction() {
    console.log(walletAddress);
    const { salt, msg } = genSignMsg();

    try {
      const data = await signMessage({
        message: msg,
      });

      const res = await walletVerify({
        chain_name: name,
        addr: walletAddress!,
        signature: data,
        salt,
      });

      if (res?.status) {
        setAddress(walletAddress!);
        setIsSign(true);
      }
    } catch (e) {
      console.error("error", e);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function signSolanaMsg() {
    if (!solanaAddress) {
      setSolanaModalVisible(true);
    } else {
      setAddress(solanaAddress);
      const { salt, msg } = genSignMsg();
      const message = new TextEncoder().encode(msg);
      const signature = await solanaSign!(message);
      const data = base58.encode(signature);
      const res = await walletVerify({
        chain_name: name,
        addr: solanaAddress!,
        signature: data,
        salt,
      });

      if (res?.status) {
        setIsSign(true);
      }
    }
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
        serial_number: serialNumber,
      }),
    });

    if (res.status) {
      handleRemove();
    }
  }

  return (
    <div className="mt-6 flex flex-col items-start md:flex-row md:items-center">
      <Popover open={popOpen} onOpenChange={(isOpen) => setPopOpen(isOpen)}>
        <PopoverTrigger
          asChild
          data-disabled={isMain || isSign}
          className="data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed"
        >
          <div
            onClick={() => setPopOpen(!popOpen)}
            className="flex h-12 w-[200px] items-center justify-between border-0 border-solid border-[#515151] md:border-b"
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
              src="/icons/arrow-down.svg"
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
      <div className="relative ml-0 mt-4 flex h-12 w-full flex-1 items-center justify-between border-b border-[rgba(255,255,255,0.2)] md:ml-4 md:mt-0 ">
        <div
          className={cn(
            "flex-1 truncate text-base leading-6 text-[#d6d6d6] md:mr-0",
            isMain ? "mr-[30px]" : "mr-0",
          )}
        >
          {address}
        </div>
        {isMain && isSign && (
          <Image
            src="/icons/sign.svg"
            width={20}
            height={20}
            alt="sign"
            className="absolute right-0 top-0 cursor-pointer md:top-[14px]"
          />
        )}
      </div>
      {!isMain &&
        (isSign ? (
          <UnlinkBtn onClick={handleOperation} disabled={opBtnDisabled} />
        ) : (
          <LinkBtn onClick={handleOperation} disabled={opBtnDisabled} />
        ))}
    </div>
  );
}

function UnlinkBtn({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
      data-disabled={disabled}
      className="ml-0 mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:border-[#FF5A5A] data-[disabled=false]:hover:bg-[#FF5A5A] md:ml-4 md:mt-0 md:w-12"
    >
      <Image
        src={isHover ? "/icons/unlink-white.svg" : "/icons/unlink.svg"}
        width={24}
        height={24}
        alt="save"
      />
      <div className="ml-1 text-base leading-6 md:hidden">Disconnect</div>
    </div>
  );
}

function LinkBtn({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
      data-disabled={disabled}
      className="ml-0 mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=false]:hover:bg-[#fff] md:ml-4 md:mt-0 md:w-12"
    >
      <Image
        src={isHover ? "/icons/link-black.svg" : "/icons/link.svg"}
        width={24}
        height={24}
        alt="save"
      />
      <div className="ml-1 text-base leading-6 md:hidden">Connect</div>
    </div>
  );
}