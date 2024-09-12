"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useChainId, useSwitchNetwork } from "wagmi";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { ChainInfos } from "@/lib/const";
import { useEthClaim } from "@/lib/use-eth-claim";
import { useEventsData } from "@/lib/use-events-data";
import { IClaimToken, useClaimData } from "@/lib/use-claim-data";
import { useSolClaim } from "@/lib/use-sol-claim";
import { useCheckSolClaimed } from "@/lib/use-check-sol-claimed";
import { useCheckEthClaimed } from "@/lib/use-check-eth-claimed";
import { useCheckOffChainClaimed } from "@/lib/use-check-off-chain-claimed";
import { useOffChainClaim } from "@/lib/use-off-chain-claim";

export default function EventsPage() {
  const { data: eventsData } = useEventsData();

  // eth
  const chainId = useChainId();
  const { address: ethAddress } = useAccount();
  const { switchNetworkAsync: switchChain } = useSwitchNetwork();
  const { open: wcModalOpen } = useWeb3Modal();

  // sol
  const { publicKey } = useWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();
  const solanaAddress = useMemo(
    () => (publicKey ? publicKey.toBase58() : ""),
    [publicKey],
  );

  const claimTokens = useMemo(() => {
    if (!eventsData || !eventsData.length) return [];

    const ts = eventsData.map((event: Record<string, any>) => {
      const chainInfo =
        event.chain_id === 0
          ? {
              isOffChain: true,
            }
          : Object.values(ChainInfos).find((info) => {
              if (
                (String(event.chain_id) === "901" ||
                  String(event.chain_id) === "902") &&
                info.name === "Solana"
              ) {
                return info;
              }

              return String(info.chainId) === String(event.chain_id);
            });

      return {
        name: event.token_name,
        symbol: event.token_symbol,
        chainInfo: chainInfo || {
          name: "Ethereum",
          logo: "/images/network-icons/ethereum.svg",
          isEVM: true,
          chainId: 11155111,
        },
        logo: event.token_url,
        tokenDecimal: event.token_decimal,
        eventData: event,
      } as IClaimToken;
    });

    return ts;
  }, [eventsData]);

  const [currentToken, setCurrentToken] = useState(claimTokens[0]);

  const isOffChain = !!(currentToken?.chainInfo as any)?.isOffChain;
  const isEVM = !!currentToken?.chainInfo?.isEVM;
  const isSolana = currentToken?.chainInfo?.name === "Solana";

  const currentAddress = useMemo(() => {
    if (isEVM || isOffChain) {
      return ethAddress;
    }

    if (isSolana) {
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

  const {
    claimAction: claimOffChainAction,
    isPending: isOffChainPending,
    isSuccess: isOffChainSuccess,
  } = useOffChainClaim();

  const isPending = useMemo(() => {
    if (isOffChain) {
      return isOffChainPending;
    }

    if (isEVM) {
      return isEthPending;
    }

    if (isSolana) {
      return isSolPending;
    }
  }, [
    isOffChain,
    isEVM,
    isSolana,
    isOffChainPending,
    isEthPending,
    isSolPending,
  ]);

  const { data: claimData } = useClaimData(currentToken, currentAddress);

  const claimAmount = useMemo(() => {
    if (!claimData) return 0;
    if (claimData?.status === true && claimData.data === null) return 0;
    return Number(claimData?.claim_amount);
  }, [claimData]);

  const showClaimAmount = useMemo(() => {
    if (!claimAmount) return 0;
    return Math.floor(claimAmount / 10 ** currentToken?.tokenDecimal || 0);
  }, [claimAmount, currentToken]);

  const { data: ethState, refetch: refreshEthClaim } = useCheckEthClaimed(
    isEVM,
    (currentToken?.chainInfo?.name?.toLowerCase() as any) || "ethereum",
    currentToken?.eventData,
    claimAmount,
  );

  const { data: solState, mutate: refreshSolClaim } = useCheckSolClaimed(
    isSolana,
    currentToken?.eventData,
  );

  const { data: offChainState, mutate: refreshOffChainClaim } =
    useCheckOffChainClaimed(
      isOffChain,
      currentToken?.eventData?.project_name,
      currentToken?.eventData?.claim_version,
    );

  const isClaimed = useMemo(() => {
    if (isOffChain) {
      return offChainState?.claimed;
    }

    if (isEVM) {
      return ethState?.claimed;
    }

    if (isSolana) {
      return solState?.claimed;
    }
  }, [isEVM, isOffChain, isSolana, ethState, solState, offChainState]);

  function handleClaim() {
    if (isClaimed || isPending) return;
    if (!currentToken || !currentToken.chainInfo) return;

    if (isEVM) {
      claimEvm();
      return;
    }

    if (isOffChain) {
      claimOffChain();
      return;
    }

    if (isSolana) {
      claimSolana();
    }
  }

  async function claimEvm() {
    if (!ethAddress) {
      wcModalOpen();
    } else {
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
        currentToken?.eventData,
      );
      if (res) {
        refreshSolClaim();
      }
      return;
    }
  }

  async function claimOffChain() {
    if (!ethAddress) {
      wcModalOpen();
    } else {
      if (String(chainId) !== String(10)) {
        try {
          await switchChain!(10);
          claimOffChainAction({
            wallet: ethAddress,
            event_name: currentToken.eventData.project_name,
            claim_version: currentToken.eventData.claim_version,
          } as any);
        } catch (e) {
          console.error("switch chain error", e);
        }
      } else {
        claimOffChainAction({
          wallet: ethAddress,
          eventName: currentToken.eventData.project_name,
          claimVersion: currentToken.eventData.claim_version,
        } as any);
      }
    }
  }

  useEffect(() => {
    if (isOffChainSuccess) {
      refreshOffChainClaim();
    }
  }, [isOffChainSuccess, refreshOffChainClaim]);

  function handleClickToken(t: IClaimToken) {
    if (!t) return;
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
    <div className="mb-[100px] ml-0 mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:mb-0 md:ml-[80px] md:rounded-[18px] md:p-[20px]">
      <div className="relative flex w-full flex-col items-center p-[35px] md:p-[56px]">
        <div className="no-scroll-bar absolute -bottom-[100px] left-0 flex h-auto w-full snap-mandatory flex-row items-end justify-between pl-4 pt-0 md:-left-[100px] md:-top-[20px] md:h-[calc(100%+20px)] md:w-auto md:snap-y md:flex-col  md:items-center md:gap-y-[18px] md:overflow-y-auto md:py-2 md:pl-0 md:pt-4">
          {claimTokens.map((t, i) => (
            <CoinItem
              key={i}
              isActive={currentToken?.name === t.name}
              onClick={() => handleClickToken(t)}
              src={t.logo}
              name={t.name}
            />
          ))}
        </div>
        {!currentAddress ? (
          <div className="flex h-[208px] flex-col items-center justify-center">
            <div
              onClick={handleConnect}
              className="mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70 data-[not=true]:cursor-not-allowed"
            >
              <div className="flex justify-between text-base leading-6 text-white">
                <span>Connect</span>
                {currentToken && (
                  <ChainLogoText
                    logo={currentToken.chainInfo.logo}
                    name={currentToken.chainInfo.name}
                  />
                )}
              </div>
            </div>
          </div>
        ) : !claimData ? (
          <div className="flex h-[208px] flex-col items-center justify-center"></div>
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
                {!isOffChain ? "$" : ""}
                {currentToken.symbol}
              </div>
            </div>
            <div
              style={{ visibility: isOffChain ? "hidden" : "visible" }}
              className="mt-1 flex items-center text-base font-medium leading-6 text-white opacity-60"
            >
              <div>on</div>
              <ChainLogoText
                logo={currentToken.chainInfo.logo}
                name={currentToken.chainInfo.name}
              />
            </div>
            <div
              data-not={isClaimed || isPending}
              onClick={handleClaim}
              className="mb-[6px] mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70 data-[not=true]:cursor-not-allowed"
            >
              <div className="flex justify-between text-base leading-6 text-white">
                {isClaimed ? (
                  "Claimed"
                ) : isPending ? (
                  "Claiming"
                ) : (
                  <>
                    <span className="font-bold">Claim</span>
                    <div
                      style={{ visibility: isOffChain ? "hidden" : "visible" }}
                      className="ml-1 flex justify-start"
                    >
                      <span>on</span>
                      <ChainLogoText
                        logo={currentToken.chainInfo.logo}
                        name={currentToken.chainInfo.name}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-[208px] flex-col items-center justify-center">
            <div className="text-[40px] leading-9 text-white opacity-80">
              Sorry!
            </div>
            <div className="mt-[10px] text-center text-[28px] font-medium leading-9 text-white">
              <span className="opacity-60">You&apos;re </span>
              <span className="opacity-80">not eligible!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CoinItem({
  src,
  onClick,
  isActive,
  name,
}: {
  src: string;
  onClick: () => void;
  isActive: boolean;
  name: string;
}) {
  function handleClick() {
    if (src) onClick();
  }

  return (
    <div
      onClick={handleClick}
      data-active={isActive}
      className="flex h-[60px] w-[60px] flex-shrink-0 flex-grow-0 cursor-pointer snap-end items-center justify-center bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] data-[active=true]:h-[80px] data-[active=false]:rounded-xl data-[active=true]:rounded-b-xl md:data-[active=true]:h-[60px] md:data-[active=true]:w-[80px] data-[active=true]:md:rounded-l-xl data-[active=true]:md:rounded-br-none"
    >
      {src && <Image src={src} width={40} height={40} alt={name} />}
    </div>
  );
}

function ChainLogoText({ logo, name }: { logo: string; name: string }) {
  return (
    <>
      <Image
        src={logo}
        width={16}
        height={16}
        alt="sol net"
        className="ml-2 mr-1"
      />
      <div className="text-base leading-6">{name}</div>
    </>
  );
}