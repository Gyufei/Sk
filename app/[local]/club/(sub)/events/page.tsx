"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAccount, useChainId, useSwitchNetwork } from "wagmi";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { GoBackTo } from "@/components/go-back-to";
import { IClaimToken, useClaimTokens } from "@/lib/api/use-claim-tokens";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useCheckEthClaimed } from "@/lib/use-check-eth-claimed";
import { useCheckOffChainClaimed } from "@/lib/use-check-off-chain-claimed";
import { useCheckSolClaimed } from "@/lib/use-check-sol-claimed";
import { useClaimData } from "@/lib/use-claim-data";
import { useEthClaim } from "@/lib/use-eth-claim";
import { useOffChainClaim } from "@/lib/use-off-chain-claim";
import { useSolClaim } from "@/lib/use-sol-claim";

export default function EventsPage() {
  const T = useTranslations("Common");
  const { data: claimTokens } = useClaimTokens();
  const { data: userInfo } = useFetchUserInfo();

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
  }, [ethAddress, solanaAddress, isEVM, isOffChain, isSolana]);

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
    trigger: claimOffChainAction,
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
  useEffect(() => {
    if (isOffChainSuccess) {
      refreshOffChainClaim();
    }
  }, [isOffChainSuccess, refreshOffChainClaim]);

  useEffect(() => {
    if (claimTokens.length) {
      setCurrentToken(claimTokens[0]);
    }
  }, [claimTokens]);

  function handleClaim() {
    if (isClaimed || isPending) return;
    if (!currentToken || !currentToken.chainInfo || currentToken.isCutOff)
      return;

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
    try {
      claimOffChainAction({
        wallet: ethAddress,
        eventName: currentToken.eventData.project_name,
        claimVersion: currentToken.eventData.claim_version,
      } as any);
    } catch (e) {
      console.error("switch chain error", e);
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null);

  function handleClickToken(t: IClaimToken, idx: number) {
    if (!t) return;
    setCurrentToken(t);

    if (!scrollRef.current) return;

    if (idx < 3) {
      scrollRef.current.scrollTop = 0;
    } else {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  function handleConnect() {
    if (isEVM || isOffChain) {
      wcModalOpen();
    } else {
      setSolanaModalVisible(true);
    }
  }

  const windFallTpl = useMemo(() => {
    return (
      <div className="absolute -left-[70px] flex flex-col">
        <div className="mb-1 text-xl leading-[30px] text-white">
          {T("Windfalls")}
        </div>
        <div className="flex items-center text-[40px] leading-[60px] text-[#d6d6d6]">
          <div className="text-[#1FEFA3]">
            {userInfo?.passed_windfalls || 0}
          </div>
          <div>/</div>
          <div>{userInfo?.total_windfalls || 0}</div>
        </div>
      </div>
    );
  }, [userInfo?.passed_windfalls, userInfo?.total_windfalls]);

  return (
    <div className="absolute md:-left-[calc(50vw-500px)] md:top-[20%]">
      <div className="relative flex items-center justify-end">
        {windFallTpl}
        <GoBackTo />
      </div>
      <div className="relative mb-[100px] ml-0 mt-6 w-[560px] rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:mb-0 md:rounded-[18px] md:p-[20px]">
        <div className="relative flex w-full flex-col items-center p-[35px] md:p-[56px]">
          <div
            ref={scrollRef}
            className="no-scroll-bar absolute -bottom-[100px] left-0 flex h-auto w-full snap-mandatory flex-row items-end justify-between pl-4 pt-0 md:-left-[100px] md:-top-[20px] md:h-[calc(100%+20px)] md:w-auto md:snap-y md:flex-col  md:items-center md:gap-y-[18px] md:overflow-y-auto md:py-2 md:pl-0 md:pt-4"
          >
            {claimTokens.map((t, i) => (
              <CoinItem
                disabled={false}
                key={i}
                isActive={currentToken?.name === t.name}
                onClick={() => handleClickToken(t, i)}
                src={t.logo}
                name={t.name}
              />
            ))}
          </div>
          {!currentToken ? (
            <div className="h-[208px]"></div>
          ) : !currentAddress ? (
            <div className="flex h-[208px] flex-col items-center justify-center">
              <div
                data-disabled={false}
                onClick={handleConnect}
                className="mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:hover:opacity-50"
              >
                <div className="flex justify-between text-base leading-6 text-white">
                  <span>Connect</span>
                  {currentToken && (
                    <ChainLogoText
                      logo={
                        isOffChain
                          ? "/icons/network/ethereum.svg"
                          : currentToken.chainInfo.logo
                      }
                      name={isOffChain ? "EVM" : currentToken.chainInfo.name}
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
              {
                <div
                  data-not={isClaimed || isPending || currentToken.isCutOff}
                  onClick={handleClaim}
                  className="mb-[6px] mt-5 box-border flex h-12 w-[240px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(255,255,255,0.01)] opacity-60 hover:opacity-70 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:hover:opacity-50"
                >
                  <div className="flex justify-between text-base leading-6 text-white">
                    {isClaimed ? (
                      "Claimed"
                    ) : currentToken.isCutOff ? (
                      "Unavailable"
                    ) : isPending ? (
                      "Claiming"
                    ) : (
                      <>
                        <span className="font-bold">Claim</span>
                        {!currentToken.chainInfo.isOffChain && (
                          <div
                            style={{
                              visibility: isOffChain ? "hidden" : "visible",
                            }}
                            className="ml-1 flex justify-start"
                          >
                            <span>on</span>
                            <ChainLogoText
                              logo={currentToken.chainInfo.logo}
                              name={currentToken.chainInfo.name}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              }
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
    </div>
  );
}

function CoinItem({
  disabled,
  src,
  onClick,
  isActive,
  name,
}: {
  disabled: boolean;
  src: string;
  onClick: () => void;
  isActive: boolean;
  name: string;
}) {
  function handleClick() {
    if (disabled) return;
    if (src) onClick();
  }

  return (
    <div
      onClick={handleClick}
      data-disabled={disabled}
      data-active={isActive}
      className="flex h-[60px] w-[60px] flex-shrink-0 flex-grow-0 cursor-pointer snap-end items-center justify-center bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] data-[active=true]:h-[80px] data-[disabled=true]:cursor-not-allowed data-[active=false]:rounded-xl data-[active=true]:rounded-b-xl data-[disabled=true]:opacity-50 md:data-[active=true]:h-[60px] md:data-[active=true]:w-[80px] data-[active=true]:md:rounded-l-xl data-[active=true]:md:rounded-br-none"
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
