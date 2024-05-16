"use client";

import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ChainInfos } from "@/lib/const";
import { useEthClaim } from "@/lib/use-eth-claim";
import { useEventsData } from "@/lib/use-events-data";
import { useAccount, useChainId, useSwitchNetwork } from "wagmi";
import { useClaimData } from "@/lib/use-claim-data";
import { useSolClaim } from "@/lib/use-sol-claim";
import { useSolClaimed } from "@/lib/use-sol-claimed";
import { useEthClaimed } from "@/lib/use-eth-claimed";
import { useAtomValue } from "jotai";
import { UuidAtom } from "@/lib/state";
import { useRouter } from "next/navigation";

interface IClaimToken {
  name: string;
  symbol: string;
  logo: string;
  chainInfo: (typeof ChainInfos)[keyof typeof ChainInfos];
  tokenDecimal: number;
}

export default function EventsPage() {
  const uuid = useAtomValue(UuidAtom);
  const router = useRouter();
  const [init, setInit] = useState(false);

  useEffect(() => {
    setInit(true);
    if (init && !uuid) {
      router.replace("/club");
    }
  }, [init, setInit, uuid, router]);

  const { data: eventsData } = useEventsData();

  // eth
  const chainId = useChainId();
  const { address: ethAddress } = useAccount();
  const { switchNetworkAsync: switchChain } = useSwitchNetwork();

  // sol
  const { publicKey } = useWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();
  const solanaAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );

  const claimTokens = useMemo(() => {
    if (eventsData) {
      const chainInfo = Object.values(ChainInfos).find((info) => {
        if (
          (String(eventsData.chain_id) === "901" ||
            String(eventsData.chain_id) === "902") &&
          info.name === "Solana"
        ) {
          return info;
        }

        return String(info.chainId) === String(eventsData.chain_id);
      });

      return [
        {
          name: eventsData.token_name,
          symbol: eventsData.token_symbol,
          chainInfo: chainInfo || {
            name: "Ethereum",
            logo: "/images/network-icons/ethereum.svg",
            isEVM: true,
            chainId: 11155111,
          },
          logo: eventsData.token_url,
          tokenDecimal: eventsData.token_decimal,
        },
      ];
    } else {
      return [];
    }
  }, [eventsData]);

  const [currentToken, setCurrentToken] = useState(claimTokens[0]);

  const currentAddress = useMemo(() => {
    if (currentToken?.chainInfo?.isEVM) {
      return ethAddress;
    }

    if (currentToken?.chainInfo?.name === "Solana") {
      return solanaAddress;
    }
  }, [currentToken, ethAddress, solanaAddress]);

  const {
    claimAction: claimEthAction,
    isPending: isEthPending,
    isSuccess: isEthSuccess,
  } = useEthClaim(
    (currentToken?.chainInfo?.name?.toLowerCase() as any) || "ethereum",
  );
  const { claimAction: claimSolanaAction, isPending: isSolPending } =
    useSolClaim();

  const isPending = useMemo(() => {
    if (currentToken?.chainInfo?.isEVM) {
      return isEthPending;
    }

    if (currentToken?.chainInfo?.name === "Solana") {
      return isSolPending;
    }
  }, [currentToken, isEthPending, isSolPending]);

  const { data: claimData } = useClaimData(
    currentToken?.chainInfo.name,
    currentAddress,
  );

  const claimAmount = useMemo(() => {
    if (!claimData) return 0;
    if (claimData?.status === true && claimData.data === null) return 0;
    return Number(claimData?.claim_amount);
  }, [claimData]);

  const showClaimAmount = useMemo(() => {
    if (!claimAmount) return 0;
    return Math.floor(claimAmount / 10 ** currentToken?.tokenDecimal || 0);
  }, [claimAmount, currentToken]);

  const { data: solState, mutate: refreshSolClaim } = useSolClaimed(
    currentToken?.chainInfo?.name === "Solana",
    eventsData,
  );

  const { data: ethState, refetch: refreshEthClaim } = useEthClaimed(
    !!currentToken?.chainInfo?.isEVM,
    eventsData,
    claimAmount,
  );

  const isClaimed = useMemo(() => {
    if (currentToken?.chainInfo?.isEVM) {
      return ethState?.claimed;
    }

    if (currentToken?.chainInfo?.name === "Solana") {
      return solState?.claimed;
    }
  }, [solState]);

  function handleClaim() {
    if (isClaimed) return;
    if (!currentToken || !currentToken.chainInfo) return;

    if (currentToken.chainInfo.isEVM) {
      claimEvm();
      return;
    }

    if (currentToken.chainInfo.name === "Solana") {
      claimSolana();
    }
  }

  async function claimEvm() {
    if (isPending) return;

    const claimChainId = currentToken.chainInfo.chainId;

    if (String(chainId) !== String(claimChainId)) {
      try {
        await switchChain!(claimChainId!);
        claimEthAction(claimAmount!, claimData.proofs);
      } catch (e) {
        console.error("switch chain error", e);
      }
    } else {
      claimEthAction(claimAmount!, claimData.proofs);
    }
  }

  useEffect(() => {
    if (isEthSuccess) {
      refreshEthClaim();
    }
  }, [isEthSuccess, refreshEthClaim]);

  async function claimSolana() {
    if (!solanaAddress) {
      setSolanaModalVisible(true);
    } else {
      const res = await claimSolanaAction(
        claimAmount!,
        claimData.proofs,
        eventsData,
      );
      if (res) {
        refreshSolClaim();
      }
      return;
    }
  }

  function handleClickToken(t: IClaimToken) {
    setCurrentToken(t);
  }

  useEffect(() => {
    if (claimTokens.length) {
      setCurrentToken(claimTokens[0]);
    }
  }, [claimTokens]);

  function handleConnect() {
    if (currentToken?.chainInfo?.isEVM) {
      return;
    } else {
      setSolanaModalVisible(true);
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent
        showOverlay={false}
        showClose={false}
        className="flex w-[345px] flex-col rounded-3xl border-none bg-[rgba(255,255,255,0.1)] p-0 outline-none backdrop-blur-[7px] md:w-[469px]"
      >
        <div className="relative flex w-full flex-col items-center p-[35px]">
          <div className="absolute -bottom-[80px] left-0 flex h-auto w-full flex-row justify-between md:-left-[80px] md:top-0 md:h-full md:w-auto md:flex-col">
            <CoinItem
              onClick={() => handleClickToken(claimTokens[0])}
              src={claimTokens[0]?.logo}
            />
            <CoinItem onClick={() => {}} src="" />
            <CoinItem onClick={() => {}} src="" />
            <CoinItem onClick={() => {}} src="" />
          </div>
          {!currentAddress ? (
            <div className="flex h-[202px] flex-col items-center justify-center">
              <div
                onClick={handleConnect}
                className="mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70 data-[not=true]:cursor-not-allowed"
              >
                <div className="text-base leading-6 text-white">Connect</div>
              </div>
            </div>
          ) : !claimData ? (
            <div className="flex h-[202px] flex-col items-center justify-center"></div>
          ) : claimAmount !== 0 ? (
            <>
              <div className="text-[28px] font-medium leading-9 text-white">
                <span className="opacity-60">You&apos;re </span>
                <span className="opacity-80">eligible!</span>
              </div>
              <div className="mt-4 flex items-center gap-x-[10px]">
                <div className="text-[36px] font-semibold leading-[54px] text-white">
                  {showClaimAmount}
                </div>
                <div className="flex h-10 items-center rounded-lg bg-[rgba(255,255,255,0.5)] px-3 py-[2px] text-[20px] font-semibold leading-[30px] text-[#262626] outline-none">
                  ${currentToken.symbol}
                </div>
              </div>
              <div className="mt-1 flex items-center text-base font-medium leading-6 text-white opacity-60">
                <div>on</div>
                <Image
                  src={currentToken.chainInfo.logo}
                  width={16}
                  height={16}
                  alt="sol net"
                  className="ml-2 mr-1"
                />
                <div>{currentToken.chainInfo.name}</div>
              </div>
              <div
                data-not={isClaimed || isPending}
                onClick={handleClaim}
                className="mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70 data-[not=true]:cursor-not-allowed"
              >
                <div className="text-base leading-6 text-white">
                  {isClaimed ? "Claimed" : isPending ? "Claiming" : "Claim"}
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-[202px] flex-col items-center justify-center">
              <div className="text-[40px] leading-9 text-white opacity-80">
                Sorry!
              </div>
              <div className="mt-[10px] text-[28px] font-medium leading-9 text-white">
                <span className="opacity-60">You&apos;re </span>
                <span className="opacity-80">not eligible!</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CoinItem({ src, onClick }: { src: string; onClick: () => void }) {
  function handleClick() {
    if (src) onClick();
  }

  return (
    <div
      onClick={handleClick}
      className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-xl bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]"
    >
      {src && <Image src={src} width={40} height={40} alt="coin" />}
    </div>
  );
}
