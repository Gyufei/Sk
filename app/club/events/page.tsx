"use client";

import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ChainInfos } from "@/lib/const";
import { useEthClaim } from "@/lib/use-eth-claim";
import { useEventsData } from "@/lib/use-events-data";
import { useChainId, useSwitchNetwork } from "wagmi";
import { useClaimData } from "@/lib/use-claim-data";
import { useSolClaim } from "@/lib/use-sol-claim";

interface IClaimToken {
  name: string;
  logo: string;
  chainInfo: (typeof ChainInfos)[keyof typeof ChainInfos];
  tokenDecimal: number;
}

export default function EventsPage() {
  const { data: eventsData } = useEventsData();

  // eth
  const chainId = useChainId();
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

  const { data: claimData } = useClaimData();
  const { claimAction: claimEthAction, isPending: isEthPending } =
    useEthClaim();
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

  const claimAmount = useMemo(() => {
    return claimData?.claim_amount;
  }, [claimData]);

  const showClaimAmount = useMemo(() => {
    return Math.floor(claimAmount / 10 ** currentToken?.tokenDecimal || 0);
  }, [claimAmount, currentToken]);

  function handleClaim() {
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
      switchChain!(claimChainId!)
        .then(() => {
          claimEthAction(claimAmount, claimData.proofs);
        })
        .catch((e) => {
          console.error("switch chain error", e);
        });
    } else {
      claimEthAction(claimAmount, claimData.proofs);
    }
  }

  async function claimSolana() {
    if (!solanaAddress) {
      setSolanaModalVisible(true);
    } else {
      claimSolanaAction(claimAmount, claimData.proofs, eventsData);
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
          {claimAmount ? (
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
                  ${currentToken.name}
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
                onClick={handleClaim}
                className="mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70"
              >
                <div className="text-base leading-6 text-white">
                  {isPending ? "Claiming" : "Claim"}
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
      {src && (
        <Image
          src={src}
          width={40}
          height={40}
          className="rounded-full"
          alt="coin"
        />
      )}
    </div>
  );
}
